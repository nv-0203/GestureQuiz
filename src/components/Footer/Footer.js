import './Footer.css';

const Footer = () => {
  return (
    <div className="container">
      <div>
        Made with ♥ by{" "}
        <a
          href="https://www.linkedin.com/in/nufail-vhora-3301b6215/"
          style={{ cursor: "pointer" }}
        >
          Nufail Vhora
        </a>
      </div>
      <div>
        {" "}
        <a
          href="https://github.com/nv-0203/GestureQuiz"
          style={{ cursor: "pointer" }}
        >
          Source Code
        </a>
      </div>
    </div>

  );
};

export default Footer;