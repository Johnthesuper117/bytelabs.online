'use client';

import { useState, useEffect, useRef } from 'react';

export default function PasswordGenPage() {
  const [password, setPassword] = useState('CLICK GENERATE');
  const [length, setLength] = useState(10);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [strength, setStrength] = useState({ width: '0%', color: '#e74c3c', text: 'Weak' });

  const resultRef = useRef<HTMLSpanElement>(null);
  const lengthRef = useRef<HTMLInputElement>(null);
  const uppercaseRef = useRef<HTMLInputElement>(null);
  const numbersRef = useRef<HTMLInputElement>(null);
  const symbolsRef = useRef<HTMLInputElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const clipboardBtnRef = useRef<HTMLButtonElement>(null);
  const strengthFillRef = useRef<HTMLDivElement>(null);
  const strengthTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Password Generator logic
    const resultEl = resultRef.current;
    const lengthEl = lengthRef.current;
    const uppercaseEl = uppercaseRef.current;
    const numbersEl = numbersRef.current;
    const symbolsEl = symbolsRef.current;
    const generateBtn = generateBtnRef.current;
    const clipboardBtn = clipboardBtnRef.current;
    const strengthFillEl = strengthFillRef.current;
    const strengthTextEl = strengthTextRef.current;

    if (!resultEl || !lengthEl || !uppercaseEl || !numbersEl || !symbolsEl || !generateBtn || !clipboardBtn || !strengthFillEl || !strengthTextEl) return;

    const randomFunc = {
      lower: getRandomLower,
      upper: getRandomUpper,
      number: getRandomNumber,
      symbol: getRandomSymbol
    };

    clipboardBtn.addEventListener('click', () => {
      const passwordText = resultEl.innerText;
      if (!passwordText || passwordText === 'CLICK GENERATE') return;
      navigator.clipboard.writeText(passwordText).then(() => {
        alert('Password copied to clipboard!');
      });
    });

    generateBtn.addEventListener('click', () => {
      const lengthVal = +lengthEl.value;
      const hasUpper = uppercaseEl.checked;
      const hasNumber = numbersEl.checked;
      const hasSymbol = symbolsEl.checked;

      const generatedPassword = generatePassword(hasUpper, hasNumber, hasSymbol, lengthVal);
      resultEl.innerText = generatedPassword;
      updateStrengthMeter(generatedPassword, lengthVal, hasUpper, hasNumber, hasSymbol);
    });

    function generatePassword(upper: boolean, number: boolean, symbol: boolean, length: number) {
      let generatedPassword = '';
      let validChars = 'abcdefghijklmnopqrstuvwxyz';

      if (upper) validChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (number) validChars += '0123456789';
      if (symbol) validChars += '!@#$%^&*(){}[]=<>/,.';

      const cryptoObj = window.crypto || (window as unknown as { msCrypto: unknown }).msCrypto;
      const charCount = validChars.length;

      function getSecureRandomIndex() {
        if (!cryptoObj || !(cryptoObj as { getRandomValues: (array: Uint8Array) => number }).getRandomValues) {
          return Math.floor(Math.random() * charCount);
        }

        const randomBytes = new Uint8Array(1);
        const maxUnbiased = Math.floor(256 / charCount) * charCount;

        while (true) {
          (cryptoObj as { getRandomValues: (array: Uint8Array) => number }).getRandomValues(randomBytes);
          const randomValue = randomBytes[0];
          if (randomValue < maxUnbiased) {
            return randomValue % charCount;
          }
        }
      }

      for (let i = 0; i < length; i++) {
        const index = getSecureRandomIndex();
        generatedPassword += validChars[index];
      }
      return generatedPassword;
    }

    function updateStrengthMeter(password: string, length: number, hasUpper: boolean, hasNumber: boolean, hasSymbol: boolean) {
      let score = 0;

      if (length > 5) score++;
      if (length > 10) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSymbol) score++;

      if (score <= 2) {
        strengthFillEl.style.width = '30%';
        strengthFillEl.style.backgroundColor = '#e74c3c';
        strengthTextEl.innerText = 'Weak';
        strengthTextEl.style.color = '#e74c3c';
      } else if (score <= 4) {
        strengthFillEl.style.width = '60%';
        strengthFillEl.style.backgroundColor = '#f39c12';
        strengthTextEl.innerText = 'Medium';
        strengthTextEl.style.color = '#f39c12';
      } else {
        strengthFillEl.style.width = '100%';
        strengthFillEl.style.backgroundColor = '#2ecc71';
        strengthTextEl.innerText = 'Strong';
        strengthTextEl.style.color = '#2ecc71';
      }
    }

    function getRandomLower() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    function getRandomUpper() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    function getRandomNumber() {
      return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }
    function getRandomSymbol() {
      const symbols = '!@#$%^&*(){}[]=<>/,.';
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        .password-gen-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #2c3e50;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          width: 350px;
          text-align: center;
          margin: 0 auto;
        }
        .password-gen-container h2 { margin-bottom: 20px; color: white; }
        .password-gen-result {
          background-color: rgba(0,0,0,0.3);
          padding: 10px;
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          letter-spacing: 1px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .password-gen-result span { word-wrap: break-word; max-width: 85%; color: white; }
        .password-gen-clipboard {
          background-color: #e67e22;
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 5px;
          margin-left: 10px;
        }
        .password-gen-clipboard:hover { background-color: #d35400; }
        .password-gen-strength { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 14px; }
        .password-gen-strength-bar { height: 10px; width: 100%; background-color: #ddd; border-radius: 5px; margin-top: 5px; overflow: hidden; }
        .password-gen-strength-fill { height: 100%; width: 0%; background-color: #e74c3c; transition: width 0.3s ease, background-color 0.3s ease; }
        .password-gen-settings { text-align: left; margin-bottom: 20px; }
        .password-gen-setting { display: flex; justify-content: space-between; margin: 10px 0; color: white; }
        .password-gen-setting input[type="number"] { width: 60px; }
        .password-gen-btn {
          background-color: #3498db;
          border: none;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          width: 100%;
        }
        .password-gen-btn:hover { background-color: #2980b9; }
      `}</style>
      <h1>Password Generator</h1>
      <div className="password-gen-container">
        <h2>Password Generator</h2>
        <div className="password-gen-result">
          <span ref={resultRef as React.RefObject<HTMLSpanElement>}>CLICK GENERATE</span>
          <button className="password-gen-clipboard" ref={clipboardBtnRef as React.RefObject<HTMLButtonElement>} title="Copy to clipboard">📋</button>
        </div>
        <div className="password-gen-strength">
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Strength:</span>
              <span ref={strengthTextRef as React.RefObject<HTMLSpanElement>}>Weak</span>
            </div>
            <div className="password-gen-strength-bar">
              <div className="password-gen-strength-fill" ref={strengthFillRef as React.RefObject<HTMLDivElement>}></div>
            </div>
          </div>
        </div>
        <div className="password-gen-settings">
          <div className="password-gen-setting">
            <label>Length</label>
            <input type="number" id="length" min="4" max="20" defaultValue="10" ref={lengthRef as React.RefObject<HTMLInputElement>} />
          </div>
          <div className="password-gen-setting">
            <label>Include Uppercase</label>
            <input type="checkbox" id="uppercase" defaultChecked ref={uppercaseRef as React.RefObject<HTMLInputElement>} />
          </div>
          <div className="password-gen-setting">
            <label>Include Numbers</label>
            <input type="checkbox" id="numbers" defaultChecked ref={numbersRef as React.RefObject<HTMLInputElement>} />
          </div>
          <div className="password-gen-setting">
            <label>Include Symbols</label>
            <input type="checkbox" id="symbols" defaultChecked ref={symbolsRef as React.RefObject<HTMLInputElement>} />
          </div>
        </div>
        <button className="password-gen-btn" id="generate" ref={generateBtnRef as React.RefObject<HTMLButtonElement>}>Generate Password</button>
      </div>
    </>
  );
}
