import Navbar from '../components/Navbar';

export default function ProfilePage() {
  return (
    <>
      <script defer src="/assets/js/dynamicTitle.js"></script>
      <h1>Profile</h1>
      <Navbar />
      <div className="content">
        <p className="centered">
          <h1>Johnthesuper117</h1>

          <h5>Interests:</h5>
          I'm into video games; playing, designing, and coding them.

          <h5>Skills:</h5>
          Scratch.mit.edu<br />
          Python<br />
          HTML/CSS<br />
          JavaScript

          <h5>Working on:</h5>
          Working on a personal website <a href="https://www.bytelabs.online">Bytelabs Online</a><br />
          I'm currently learning how to make video games using C++ for game engines like Source 2013, Unity, Unreal, etc.

          <h5>Socials:</h5>
          <a href="https://scratch.mit.edu/users/radking_12/"><img src="https://img.shields.io/badge/radking__12-12?logo=Scratch&logoColor=yellow&label=Scratch&labelColor=grey&color=yellow" alt="Scratch" /></a><br />
          <a href="https://steamcommunity.com/profiles/76561199811025523/"><img src="https://img.shields.io/badge/Johnthesuper117-1?logo=steam&logoColor=blue&label=Steam&labelColor=grey&color=blue" alt="Steam" /></a>

          <h5>GitHub Stats:</h5>
          <img src="https://github-readme-stats.vercel.app/api/top-langs?username=johnthesuper117&theme=dark&show_icons=true&locale=en&layout=compact&title_color=20C20E&text_color=20C20E&icon_color=20C20E&border_color=20C20E&bg_color=000000" alt="GitHub Top Languages" /><br />
          <img src="https://github-readme-stats.vercel.app/api?username=johnthesuper117&theme=dark&show_icons=true&locale=en&title_color=20C20E&text_color=20C20E&icon_color=20C20E&border_color=20C20E&bg_color=000000" alt="GitHub Stats" /><br />
          <img src="https://streak-stats.demolab.com?user=Johnthesuper117&theme=hacker&short_numbers=true" alt="GitHub Streak" /><br />
          <img src="https://github-profile-trophy.vercel.app/?username=Johnthesuper117&theme=matrix" alt="GitHub Trophy" />

          <h5>Lore:</h5>
          Ever since I was in middle school, I have been interested in video game development. So I started using <a href="https://scratch.mit.edu">Scratch.mit.edu</a> and started learning how coding worked, and played some games as well.
          <br />
          <br />
        </p>
      </div>
    </>
  );
}
