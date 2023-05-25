import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">AI powered Blog application<br /><span className='openai'>Powered by OpenAI</span></span>
        <span className="headerTitleLg">BlogSpot</span>
      </div>
      <img
        className="headerImg"
        src="images/blog.jpg"
        alt=""
      />
    </div>
  );
}
