import React, { useState, useRef, useEffect, useCallback } from "react";

const App = () => {
  // ────────────────────────────── STATE & REFS ──────────────────────────────
  const [activeFaq, setActiveFaq] = useState(0); // first FAQ open by default
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // video autoplays
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);
  const sliderWrapperRef = useRef(null);

  // ────────────────────────────── BODY STYLES ──────────────────────────────
  useEffect(() => {
    document.body.style.background = "#ffffff";
    document.body.style.overflowX = "hidden";
    document.body.style.color = "#111";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    return () => {
      document.body.style.background = "";
      document.body.style.overflowX = "";
      document.body.style.color = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  // ────────────────────────────── INJECT FONTS & ICONS ──────────────────────
  useEffect(() => {
    // Google Font
    const googleFont = document.createElement("link");
    googleFont.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap";
    googleFont.rel = "stylesheet";
    document.head.appendChild(googleFont);

    // Font Awesome
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fontAwesome);

    return () => {
      document.head.removeChild(googleFont);
      document.head.removeChild(fontAwesome);
    };
  }, []);

  // ────────────────────────────── VIDEO PLAY/PAUSE ──────────────────────────
  const toggleVideo = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  // ────────────────────────────── FAQ TOGGLE ────────────────────────────────
  const handleFaqClick = (index) => {
    setActiveFaq((prev) => (prev === index ? -1 : index));
  };

  // ────────────────────────────── SLIDER HELPERS ────────────────────────────
  const getMoveAmount = useCallback(() => {
    if (!sliderRef.current) return 344;
    const card = sliderRef.current.querySelector(".card");
    if (!card) return 344;
    const cardWidth = card.offsetWidth;
    const gap = 24;
    if (window.innerWidth <= 380) return cardWidth + 12;
    if (window.innerWidth <= 500) return cardWidth + 16;
    return cardWidth + gap;
  }, []);

  const getMaxScroll = useCallback(() => {
    if (!sliderRef.current || !sliderWrapperRef.current) return 0;
    return (
      sliderRef.current.scrollWidth - sliderWrapperRef.current.clientWidth
    );
  }, []);

  const handleNext = useCallback(() => {
    const moveAmount = getMoveAmount();
    const maxScroll = getMaxScroll();
    setCurrentPosition((prev) => {
      const next = prev + moveAmount;
      return next > maxScroll ? maxScroll : next;
    });
  }, [getMoveAmount, getMaxScroll]);

  const handlePrev = useCallback(() => {
    const moveAmount = getMoveAmount();
    setCurrentPosition((prev) => {
      const next = prev - moveAmount;
      return next < 0 ? 0 : next;
    });
  }, [getMoveAmount]);

  // ────────────────────────────── RESIZE HANDLER ────────────────────────────
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const maxScroll = getMaxScroll();
        setCurrentPosition((prev) => {
          if (prev > maxScroll) return maxScroll;
          return prev;
        });
      }, 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [getMaxScroll]);

  // ────────────────────────────── MOBILE NAV ────────────────────────────────
  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);

  // ────────────────────────────── RENDER ────────────────────────────────────
  return (
    <>
      {/* ========================= INLINE STYLES ========================= */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        /* Global typographic accents */
        .thin {
          font-weight: 300;
          color: #111;
        }

        .bold {
          font-weight: 800;
          color: #111;
        }

        .color {
          font-weight: 800;
          color: #D0DDE6;
        }

        nav {
          width: 800px;
          height: 64px;
          background-color: #ffffff;
          border-radius: 25px;
          position: absolute;
          z-index: 5;
          top: 2%;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }

        .container {
          height: 100vh;
          width: 1670px;
          overflow-y: hidden;
          display: flex;
          justify-content: center;
        }

        /* Header */
        .header {
          height: 90px;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          padding-left: 30px;
          font-weight: bold;
          justify-content: space-between;
        }

        .boder {
          border-radius: 25px;
          background-color: transparent;
          border: 2px solid black;
          width: 110px;
          height: 50px;
          cursor: pointer;
        }

        .black {
          border-radius: 25px;
          background-color: black;
          color: #ffffff;
          width: 110px;
          height: 50px;
          cursor: pointer;
        }

        .head {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 21%;
        }

        /* Hero */
        .hero {
          background: #c6e3a4;
          height: 750px;
          width: 1300px;
          margin: -40px auto 0 auto;
          position: absolute;
          top: 7%;
          left: 1%;
          z-index: 2;
          clip-path: path("M 10,80 L 50,80   A20,20 0,0,0   70,70 L 70,20   A20,20 0,0,1   80,0 L 1280,0   A20,20 0,0,1    1300,20 L 1300,600    A20,20 0,0,1   1280,620   A20,20 0,0,0   1260,640 L  1260,730 A20,20 0,0,1   1240,750 L 920,750    A20,20 0,0,1    900,730 L 900,640   A20,20 0,0,0 890,620 L 10,620 A20,20 0,0,1 0,600 L 0,100 A20,20 0,0,1 10,80 Z");
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
        }

        .hero img {
          height: auto;
          width: 100%;
        }

        li {
          list-style: none;
        }

        .box {
          height: 200px;
          width: 250px;
          border-radius: 20px;
          position: absolute;
          z-index: 5;
          background-color: #ffffff;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          align-items: center;
          left: 1%;
          bottom: 20%;
        }

        .box h6 {
          width: 200px;
          font-size: 11px;
        }

        .box p {
          width: 200px;
          font-size: 10px;
        }

        .box button {
          width: 80%;
          height: 45px;
          border-radius: 25px;
          background-color: black;
          color: #ffffff;
        }

        .icons,
        .tabs {
          position: absolute;
          z-index: 5;
        }

        .tabs {
          display: flex;
          flex-direction: column;
          color: #ffffff;
          left: 1%;
          font-size: 30px;
          line-height: 50px;
          height: 200px;
          width: 50px;
          justify-content: space-around;
          bottom: 50%;
        }

        .icons {
          display: flex;
          color: #ffffff;
          font-size: 30px;
          line-height: 50px;
          height: 50px;
          width: 200px;
          justify-content: space-around;
          right: 5%;
          bottom: 1%;
        }

        .li {
          border-radius: 50%;
          border: 1px solid #ffffff;
          height: 50px;
          width: 50px;
          text-align: center;
          cursor: pointer;
        }

        .lii {
          border-radius: 50%;
          border: 1px solid #000000;
          height: 40px;
          width: 40px;
          text-align: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* content */
        .hero-content {
          z-index: 3;
          position: absolute;
          width: 350px;
          height: 680px;
          right: 0.2%;
          padding-right: 1%;
          padding-left: 1%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .h1 {
          font-size: 28px;
        }

        .cont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 180px;
        }

        .cont img {
          height: 70px;
          width: 70px;
          border-radius: 50%;
        }

        .parah {
          height: 280px;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
        }

        .parah h1 {
          width: 300px;
        }

        .parah p {
          width: 190px;
        }

        .starts li {
          font-size: 30px;
        }

        .marqeeu {
          height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* Marquee track styles */
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scrollMarquee 25s linear infinite;
        }

        /* Pause on hover */
        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes scrollMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marq-left,
        .marq-center,
        .marq-right {
          display: flex;
          gap: 0;
          width: max-content;
          flex-shrink: 0;
        }

        /* Ensure each item has consistent spacing */
        .bo {
          border: 2px solid black;
          border-radius: 25px;
          height: 30px;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 8px;
          flex-shrink: 0;
        }

        .circle {
          height: 40px;
          width: 40px;
          border: 2px solid black;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .play {
          text-align: end;
          font-size: 20px;
          cursor: pointer;
        }

        .heading {
          position: absolute;
          z-index: 5;
          font-size: 40px;
          bottom: 4%;
          width: 800px;
          left: 1%;
        }

        /* =========================
        MAIN CONTACT SECTION
        ========================== */

        .contact-section {
          width: 100%;
          min-height: 100vh;
          padding: 50px 70px;
          display: flex;
          justify-content: space-between;
          gap: 70px;
        }

        .left-side {
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .small-title {
          color: #b3b7bf;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .main-heading {
          font-size: 95px;
          line-height: 95px;
          font-weight: 300;
          margin-bottom: 70px;
          color: #111;
        }

        .main-heading span {
          color: #D0DDE6;
          font-weight: 800;
        }

        .locations {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-bottom: 70px;
        }

        .location-box h3 {
          font-size: 22px;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .location-box p {
          font-size: 15px;
          color: #D0DDE6;
          line-height: 28px;
        }

        .email {
          font-size: 45px;
          font-weight: 500;
          color: #111;
          margin-top: 20px;
        }

        .right-side {
          width: 45%;
          padding-top: 30px;
        }

        .social-icons {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-bottom: 70px;
        }

        .social-icons a {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: 0.3s;
        }

        .social-icons a:hover {
          background: #D0DDE6;
          color: #111;
        }

        .right-text {
          width: 320px;
          margin-left: auto;
          margin-bottom: 70px;
        }

        .right-text p {
          font-size: 20px;
          line-height: 35px;
          color: #333;
        }

        .contact-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }

        .input-box {
          display: flex;
          flex-direction: column;
        }

        .input-box input,
        .input-box textarea {
          width: 100%;
          border: none;
          border-bottom: 2px solid #d6dbe3;
          background: transparent;
          padding: 15px 0;
          font-size: 18px;
          outline: none;
          color: #111;
        }

        .input-box textarea {
          resize: none;
          height: 90px;
        }

        .full-width {
          grid-column: 1/3;
        }

        .submit-btn {
          width: 180px;
          height: 55px;
          border: none;
          border-radius: 40px;
          background: #111;
          color: #fff;
          font-size: 17px;
          cursor: pointer;
          transition: 0.3s;
        }

        .submit-btn:hover {
          background: #D0DDE6;
          color: #111;
        }

        /* Brand */
        .brand-section {
          width: 100%;
          padding: 0 70px 30px;
          overflow: hidden;
        }

        .brand-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 15px;
          color: #111;
        }

        .center-icon {
          font-size: 28px;
          color: #111;
        }

        .brand-name {
          font-size: 400px;
          line-height: 250px;
          font-weight: 400;
          letter-spacing: 8px;
          color: #111;
          text-transform: uppercase;
          text-align: center;
        }

        /* Responsive */
        @media(max-width:1100px) {
          .main-heading {
            font-size: 75px;
            line-height: 75px;
          }
          .brand-name {
            font-size: 220px;
            line-height: 190px;
          }
        }

        @media(max-width:991px) {
          .contact-section {
            flex-direction: column;
          }
          .left-side,
          .right-side {
            width: 100%;
          }
          .brand-name {
            font-size: 160px;
            line-height: 150px;
          }
        }

        @media(max-width:700px) {
          .contact-section {
            padding: 40px 25px;
          }
          .brand-section {
            padding: 0 25px 25px;
          }
          .main-heading {
            font-size: 55px;
            line-height: 60px;
          }
          .locations {
            grid-template-columns: 1fr;
          }
          .contact-form {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: 1/2;
          }
          .right-text {
            width: 100%;
          }
          .email {
            font-size: 28px;
            word-break: break-word;
          }
          .brand-top {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          .brand-name {
            font-size: 90px;
            line-height: 90px;
          }
        }

        /* Q&A */
        .container1 {
          width: 90%;
          margin: auto;
          padding: 50px 0;
          display: flex;
          justify-content: space-between;
          gap: 60px;
          min-height: 90vh;
        }

        .left {
          width: 50%;
        }

        .hero-title {
          font-size: 90px;
          line-height: 0.9;
          font-weight: 300;
          letter-spacing: -4px;
          margin-bottom: 40px;
        }

        .hero-title .bold {
          font-weight: 800;
          color: #000;
        }

        .hero-title .highlight {
          color: #D0DDE6;
          font-weight: 300;
        }

        .video-card {
          position: relative;
          width: 360px;
          border-radius: 22px;
          overflow: hidden;
          background: #000;
        }

        .video-card video {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          filter: brightness(70%);
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 20px;
          color: #fff;
        }

        .video-text {
          max-width: 220px;
          font-size: 15px;
          line-height: 1.5;
        }

        .play-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #fff;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          color: #fff;
          font-size: 22px;
          cursor: pointer;
          transition: 0.3s;
        }

        .play-btn:hover {
          background: #fff;
          color: #000;
          transform: scale(1.1);
        }

        .right {
          width: 50%;
          padding-top: 30px;
        }

        .faq-item {
          border-top: 1px solid #b9c0c7;
          padding: 28px 0;
          cursor: pointer;
          transition: 0.3s;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .faq-number {
          color: #b5bcc3;
          font-size: 14px;
          margin-right: 10px;
        }

        .faq-title {
          font-size: 26px;
          font-weight: 500;
          flex: 1;
          line-height: 1.2;
        }

        .faq-icon {
          font-size: 28px;
          transition: 0.3s;
        }

        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          color: #5c7c92;
          padding-left: 35px;
        }

        .faq-content p {
          margin-top: 15px;
          line-height: 1.7;
          font-size: 15px;
          max-width: 500px;
        }

        .faq-item.active .faq-content {
          max-height: 200px;
        }

        .faq-item.active .faq-icon {
          transform: rotate(45deg);
        }

        .book-btn {
          margin-top: 20px;
          padding: 13px 26px;
          border: none;
          border-radius: 40px;
          background: #697b89;
          color: #fff;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }

        .book-btn:hover {
          background: #2e5b74;
        }

        @media(max-width:1000px) {
          .container1 {
            flex-direction: column;
          }
          .left,
          .right {
            width: 100%;
          }
          .hero-title {
            font-size: 65px;
          }
          .video-card {
            width: 100%;
          }
        }

        @media(max-width:600px) {
          .hero-title {
            font-size: 48px;
          }
          .faq-title {
            font-size: 20px;
          }
        }

        /* Slider */
        .section {
          width: 92%;
          margin: auto;
          padding: 60px 0 90px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 60px;
          margin-bottom: 70px;
        }

        .headings {
          font-size: 92px;
          line-height: 0.92;
          letter-spacing: -4px;
          font-weight: 300;
          max-width: 950px;
        }

        .headings .light {
          color: #D0DDE6;
        }

        .headings .bold {
          font-weight: 800;
          color: #222;
        }

        .slider-content {
          max-width: 340px;
          padding-top: 25px;
        }

        .slider-content p {
          font-size: 15px;
          line-height: 1.9;
          color: #4d728d;
        }

        .slider-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .controls {
          display: flex;
          gap: 16px;
        }

        .btn {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 1.5px solid #909aa5;
          background: transparent;
          color: #333;
          font-size: 24px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        .slider-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .cards {
          display: flex;
          gap: 24px;
          transition: 0.5s ease;
          will-change: transform;
        }

        .card {
          min-width: 320px;
          height: 350px;
          background: #D0DDE6;
          border-radius: 28px;
          padding: 32px;
          position: relative;
          flex-shrink: 0;
          transition: 0.4s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .card:hover {
          transform: scale(1.08);
          background: #bdd4e4;
          z-index: 99;
        }

        .card h3 {
          font-size: 31px;
          line-height: 1.1;
          margin-bottom: 18px;
          font-weight: 500;
          color: #111;
        }

        .card p {
          font-size: 15px;
          line-height: 1.8;
          color: #5e6670;
          max-width: 240px;
        }

        .number {
          position: absolute;
          bottom: -30px;
          right: 18px;
          font-size: 125px;
          font-weight: 300;
          line-height: 1;
          color: #111;
          opacity: 0.95;
        }

        @media(max-width:1100px) {
          .top {
            flex-direction: column;
          }
          .headings {
            font-size: 70px;
          }
          .slider-content {
            padding-top: 0;
          }
          .card {
            min-width: 290px;
            height: 330px;
          }
          .card h3 {
            font-size: 27px;
          }
          .card p {
            font-size: 14px;
            max-width: 220px;
          }
          .number {
            font-size: 105px;
          }
        }

        @media(max-width:768px) {
          .headings {
            font-size: 52px;
            letter-spacing: -2px;
          }
          .card {
            min-width: 260px;
            height: 310px;
            padding: 24px;
            border-radius: 24px;
          }
          .card h3 {
            font-size: 23px;
          }
          .card p {
            font-size: 13px;
            max-width: 200px;
          }
          .number {
            font-size: 90px;
            bottom: -22px;
            right: 12px;
          }
          .btn {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          .controls {
            gap: 10px;
          }
          .section {
            padding: 40px 0 60px;
          }
          .top {
            gap: 30px;
            margin-bottom: 40px;
          }
        }

        @media(max-width:500px) {
          .headings {
            font-size: 40px;
            letter-spacing: -1px;
          }
          .card {
            min-width: 230px;
            height: 280px;
            padding: 20px;
            border-radius: 22px;
          }
          .card h3 {
            font-size: 20px;
            margin-bottom: 12px;
          }
          .card p {
            font-size: 12px;
            max-width: 170px;
            line-height: 1.6;
          }
          .number {
            font-size: 75px;
            bottom: -18px;
            right: 10px;
          }
          .btn {
            width: 42px;
            height: 42px;
            font-size: 18px;
          }
          .controls {
            gap: 8px;
          }
          .cards {
            gap: 16px;
          }
          .section {
            width: 94%;
            padding: 30px 0 50px;
          }
          .slider-top {
            margin-bottom: 20px;
          }
        }

        @media(max-width:380px) {
          .headings {
            font-size: 34px;
          }
          .card {
            min-width: 200px;
            height: 260px;
            padding: 16px;
            border-radius: 20px;
          }
          .card h3 {
            font-size: 17px;
            margin-bottom: 10px;
          }
          .card p {
            font-size: 11px;
            max-width: 150px;
            line-height: 1.5;
          }
          .number {
            font-size: 60px;
            bottom: -14px;
            right: 8px;
          }
          .btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
          .cards {
            gap: 12px;
          }
          .section {
            width: 95%;
            padding: 25px 0 40px;
          }
        }

        /* Resort banner */
        .resort-banner {
          width: 100%;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 20px 60px;
          background: #ffffff;
        }

        .resort-heading {
          font-size: 95px;
          font-weight: 300;
          color: #111;
          margin-bottom: 45px;
          line-height: 1.05;
          letter-spacing: -3px;
        }

        .resort-heading .thin-text {
          font-weight: 300;
          color: #111;
        }

        .resort-heading .bold-text {
          font-weight: 800;
          color: #111;
        }

        .resort-heading .color-text {
          font-weight: 800;
          color: #D0DDE6;
        }

        .resort-services {
          display: flex;
          gap: 55px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .service-box {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 15px;
          font-weight: 400;
        }

        .service-icon {
          font-size: 18px;
          color: #777;
        }

        @media(max-width:1100px) {
          .resort-heading {
            font-size: 72px;
            letter-spacing: -2px;
          }
        }

        @media(max-width:768px) {
          .resort-heading {
            font-size: 48px;
            letter-spacing: -1px;
          }
          .resort-services {
            gap: 20px;
          }
          .service-box {
            font-size: 14px;
          }
          .resort-banner {
            padding: 50px 20px 40px;
          }
        }

        @media(max-width:480px) {
          .resort-heading {
            font-size: 36px;
            letter-spacing: -0.5px;
          }
          .resort-services {
            gap: 14px;
          }
          .service-box {
            font-size: 12px;
          }
        }

        /* Hamburger */
        .hamburger {
          display: none;
          font-size: 28px;
          cursor: pointer;
        }

        .mobile-nav {
          position: fixed;
          top: 0;
          left: -100%;
          width: 260px;
          height: 100vh;
          background: #fff;
          z-index: 1000;
          transition: .4s;
          padding: 100px 20px;
        }

        .mobile-nav.active {
          left: 0;
        }

        .mobile-nav li {
          padding: 15px 0;
          border-bottom: 1px solid #ddd;
          font-size: 20px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .5);
          display: none;
          z-index: 999;
        }

        .overlay.active {
          display: block;
        }

        /* Responsive hero */
        @media (max-width:992px) {
          nav {
            display: none;
          }
          .hamburger {
            display: block;
          }
          .container {
            height: auto;
            flex-direction: column;
            align-items: center;
            width: 100%;
            overflow-y: visible;
          }
          .hero {
            position: relative;
            width: 95%;
            height: auto;
            margin-top: 10px;
            transform: none;
            border-radius: 25px;
            overflow: hidden;
          }
          .hero-content {
            position: relative;
            width: 90%;
            right: auto;
            height: auto;
            margin-top: 30px;
            gap: 25px;
          }
          .heading {
            position: relative;
            width: 90%;
            left: auto;
            bottom: auto;
            text-align: center;
            margin-top: 30px;
            font-size: 28px;
          }
          .box {
            width: 220px;
            height: 140px;
            bottom: 20px;
            left: 20px;
          }
          .box h6 {
            width: 100px;
            font-size: 7px;
          }
          .box p {
            width: 200px;
            font-size: 6px;
          }
          .tabs {
            left: 15px;
            bottom: 45%;
          }
          .icons {
            right: 20px;
            bottom: 15px;
          }
          .cont {
            flex-wrap: wrap;
            gap: 20px;
            height: auto;
            justify-content: center;
            align-items: center;
          }
          .img {
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          .tabs {
            display: block;
          }
          .icons {
            display: block;
          }
          .parah {
            height: auto;
            gap: 20px;
          }
          .marqeeu {
            height: 250px;
          }
          .marq-left,
          .marq-center,
          .marq-right {
            width: 100%;
            flex-wrap: wrap;
            gap: 10px;
          }
          .head {
            width: auto;
            gap: 10px;
          }
          .h1 {
            font-size: 28px;
            width: 105%;
            text-align: center;
          }
        }

        @media (max-width:768px) {
          .header {
            height: 60px;
            padding: 0 15px;
          }
          .head h3 {
            font-size: 20px;
          }
          .boder,
          .black {
            width: 80px;
            height: 35px;
            font-size: 10px;
          }
          .hero {
            border-radius: 25px;
            overflow: hidden;
          }
          .tabs .li {
            width: 38px;
            height: 38px;
            font-size: 15px;
          }
          .box {
            width: 180px;
            left: 15px;
            bottom: 15px;
          }
          .box h6 {
            width: 100px;
            font-size: 7px;
          }
          .box p {
            width: 100px;
            font-size: 6px;
          }
          .box button {
            height: 32px;
            font-size: 10px;
          }
          .icons {
            font-size: 20px;
          }
          .hero-content {
            text-align: center;
          }
          .parah h1,
          .parah p {
            width: 100%;
          }
          .parah h1 {
            font-size: 25px;
          }
          .heading {
            font-size: 22px;
          }
          .circle {
            height: 35px;
            width: 35px;
            font-size: 14px;
          }
        }

        @media (max-width:480px) {
          .head {
            gap: 5px;
          }
          .head h3 {
            font-size: 17px;
          }
          .boder,
          .black {
            width: 65px;
            height: 30px;
            font-size: 8px;
          }
          .tabs .li {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
          .box {
            width: 150px;
            padding: 10px;
          }
          .icons {
            font-size: 16px;
          }
          .cont img {
            width: 55px;
            height: 55px;
          }
          .lii {
            width: 32px;
            height: 32px;
          }
          .heading {
            font-size: 18px;
          }
        }

        @media (max-width:1200px) {
          .container {
            width: 100%;
            overflow: hidden;
          }
          .hero {
            width: 95%;
            left: 50%;
            transform: translateX(-50%);
          }
          .hero-content {
            width: 320px;
          }
          .heading {
            width: 90%;
            font-size: 30px;
          }
        }

        /* Azure section */
        .azure-resort-section {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .azure-about-text {
          position: absolute;
          top: 90px;
          left: 35px;
          width: 250px;
          color: #8a8f98;
          font-size: 15px;
          line-height: 1.7;
          font-family: Arial, Helvetica, sans-serif;
        }

        .azure-service-text {
          position: absolute;
          top: 350px;
          left: 330px;
          width: 230px;
          color: #8a8f98;
          font-size: 15px;
          line-height: 1.7;
          font-family: Arial, Helvetica, sans-serif;
        }

        .azure-button-box {
          position: absolute;
          left: 35px;
          bottom: 110px;
        }

        .azure-button-box button {
          padding: 18px 38px;
          border: none;
          border-radius: 40px;
          background: #111;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          transition: 0.3s;
        }

        .azure-button-box button:hover {
          background: #D0DDE6;
        }

        .azure-main-heading {
          position: absolute;
          right: 40px;
          top: 60px;
          line-height: 0.95;
          font-family: Arial, Helvetica, sans-serif;
        }

        .azure-main-heading h1 {
          font-size: 110px;
          font-weight: 300;
          color: #111;
        }

        .azure-bold-text {
          font-weight: 800;
        }

        .azure-colored-text {
          color: #D0DDE6;
          font-weight: 800;
        }

        @media (max-width:1200px) {
          .azure-main-heading h1 {
            font-size: 80px;
          }
          .azure-service-text {
            left: 180px;
          }
        }

        @media (max-width:992px) {
          .azure-main-heading {
            right: 30px;
            top: 80px;
          }
          .azure-main-heading h1 {
            font-size: 65px;
          }
          .azure-about-text {
            width: 220px;
            font-size: 14px;
          }
          .azure-service-text {
            width: 200px;
            left: 120px;
            top: 330px;
            font-size: 14px;
          }
        }

        @media (max-width:768px) {
          .azure-resort-section {
            height: auto;
            padding: 40px 20px 60px;
            overflow: hidden;
          }
          .azure-about-text {
            position: relative;
            top: auto;
            left: auto;
            width: 100%;
            margin-bottom: 35px;
            font-size: 14px;
          }
          .azure-service-text {
            position: relative;
            top: auto;
            left: auto;
            width: 100%;
            margin-bottom: 35px;
            font-size: 14px;
          }
          .azure-button-box {
            position: relative;
            left: auto;
            bottom: auto;
            margin-bottom: 50px;
          }
          .azure-button-box button {
            padding: 16px 30px;
            font-size: 14px;
          }
          .azure-main-heading {
            position: relative;
            right: auto;
            top: auto;
            width: 100%;
          }
          .azure-main-heading h1 {
            font-size: 48px;
            line-height: 1;
          }
        }

        @media (max-width:480px) {
          .azure-main-heading h1 {
            font-size: 38px;
          }
          .azure-about-text,
          .azure-service-text {
            font-size: 13px;
            line-height: 1.6;
          }
          .azure-button-box button {
            width: 100%;
            border-radius: 12px;
          }
        }

        .res {
          width: 70px;
          display: flex;
          justify-content: space-between;
        }
      `}</style>

      {/* ========================= HERO SECTION ========================= */}
      <div className="header">
        <div className="res">
          <div className="hamburger" onClick={toggleMobileNav}>
            <i className="fas fa-bars"></i>
          </div>
          <i className="fas fa-heart circle"></i>
        </div>
        <div className="head">
          <h3>AZURE</h3>
          <button className="boder">DISCOVER</button>
          <button className="black">CONTACT</button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav${mobileNavOpen ? " active" : ""}`} id="mobileNav">
        <li>Home</li>
        <li>Villas</li>
        <li>Dining</li>
        <li>Spa</li>
        <li>Experiences</li>
        <li>Contact</li>
      </div>
      <div
        className={`overlay${mobileNavOpen ? " active" : ""}`}
        id="overlay"
        onClick={toggleMobileNav}
      ></div>

      <div className="container">
        <div className="hero">
          <img src="/img/11.png" alt="Azure Resort" />
          <nav>
            <li>Home</li>
            <li>Villas</li>
            <li>Dining</li>
            <li>Spa</li>
            <li>Experiences</li>
            <li>Contact</li>
          </nav>
          <div className="tabs">
            <li className="li">
              <i className="fas fa-home"></i>
            </li>
            <li className="li">
              <i className="fas fa-user"></i>
            </li>
            <li className="li">
              <i className="fas fa-envelope"></i>
            </li>
          </div>
          <div className="box">
            <h6>AZURE LUXURY RESORT</h6>
            <p>
              Immerse yourself in breathtaking ocean views,private infinity
              pools, and world-class spa rituals.Immerse yourself in
              breathtaking ocean views,private infinity pools, and world-class
              spa rituals.
            </p>
            <button>here me!</button>
          </div>
          <div className="icons">
            <li className="li">
              <i className="fas fa-phone"></i>
            </li>
            <li className="li">
              <i className="fas fa-heart"></i>
            </li>
            <li className="li">
              <i className="fas fa-star"></i>
            </li>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="h1">
            <span className="thin">YOUR</span>{" "}
            <span className="bold">AZURE</span>{" "}
            <span className="color">JOURNEY</span>
          </h1>

          <div className="cont">
            <div className="img">
              <img src="/img/12.png" alt="" />
              <img src="/img/13.png" alt="" />
              <img src="/img/14.png" alt="" />
            </div>
            <div className="stars">
              <li className="lii">
                <i className="fas fa-star"></i>
              </li>
              <li className="lii">
                <i className="fas fa-star"></i>
              </li>
              <li className="lii">
                <i className="fas fa-star"></i>
              </li>
            </div>
          </div>

          <div className="parah">
            <h1>
              <span className="thin">SIGNATURE</span>{" "}
              <span className="bold color">COLLECTION</span>
            </h1>
            <p>
              Discover handcrafted luxury at Azure: panoramic sea-view suites,
              curated wellness journeys.
            </p>
            <li className="play">
              <i className="fa fa-play"></i>
            </li>
          </div>

          {/* ANIMATED MARQUEE */}
          <div className="marqeeu">
            {/* Row 1 */}
            <div className="marquee-track">
              <div className="marq-left">
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
              </div>
            </div>
            {/* Row 2 */}
            <div className="marquee-track">
              <div className="marq-center">
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
              </div>
            </div>
            {/* Row 3 */}
            <div className="marquee-track">
              <div className="marq-right">
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
                <li className="bo">OCEAN</li>
                <li className="bo">POOL</li>
                <li className="bo">DINING</li>
                <li className="bo">SPA</li>
                <li className="bo">YACHT</li>
                <li className="bo">SUITE</li>
              </div>
            </div>
          </div>
        </div>

        <div className="heading">
          <h1>
            <span className="thin">THE</span>{" "}
            <span className="bold">AZURE</span>{" "}
            <span className="color">ESCAPE</span>
          </h1>
        </div>
      </div>

      {/* ========================= AZURE RESORT SECTION ========================= */}
      <section className="azure-resort-section">
        <div className="azure-about-text">
          Escape into timeless elegance where crystal waters, private villas,
          luxury dining, and breathtaking sunsets create unforgettable memories
          for every guest who visits AZURE.
        </div>
        <div className="azure-service-text">
          Our resort offers world-class comfort, personalized experiences,
          peaceful surroundings, and exceptional hospitality throughout your
          stay.
        </div>
        <div className="azure-button-box">
          <button>Book Your Stay</button>
        </div>
        <div className="azure-main-heading">
          <h1>Over 15 Years</h1>
          <h1>
            of <span className="azure-bold-text">Luxury</span>
          </h1>
          <h1>
            <span className="azure-colored-text">Resort</span> Living
          </h1>
          <h1>Experience</h1>
        </div>
      </section>

      {/* ========================= SLIDER / CARDS SECTION ========================= */}
      <section className="section">
        <div className="top">
          <h1 className="headings">
            More than <span className="light">a paradise</span>
            <br />
            <span className="bold">Your luxury escape</span>
          </h1>
          <div className="slider-content">
            <p>
              At AZURE Resort, every stay is designed with elegance, comfort,
              and unforgettable oceanfront experiences for travelers who seek
              true luxury and peaceful moments.
            </p>
          </div>
        </div>
        <div className="slider-top">
          <div></div>
          <div className="controls">
            <button className="btn" id="prev" onClick={handlePrev}>
              ←
            </button>
            <button className="btn" id="next" onClick={handleNext}>
              →
            </button>
          </div>
        </div>
        <div className="slider-wrapper" ref={sliderWrapperRef}>
          <div
            className="cards"
            id="slider"
            ref={sliderRef}
            style={{ transform: `translateX(-${currentPosition}px)` }}
          >
            <div className="card">
              <h3>
                Oceanfront
                <br />
                Suites
              </h3>
              <p>
                Elegant luxury suites with breathtaking sea views and premium
                comfort.
              </p>
              <div className="number">01</div>
            </div>
            <div className="card">
              <h3>
                Private Villa
                <br />
                Experience
              </h3>
              <p>
                Exclusive villas with private pools and personalized resort
                services.
              </p>
              <div className="number">02</div>
            </div>
            <div className="card">
              <h3>
                Spa & Wellness
                <br />
                Retreat
              </h3>
              <p>
                Relax with luxury spa therapies and wellness programs beside the
                ocean.
              </p>
              <div className="number">03</div>
            </div>
            <div className="card">
              <h3>
                Fine Dining
                <br />
                Experience
              </h3>
              <p>
                Enjoy gourmet cuisine prepared by world-class international
                chefs.
              </p>
              <div className="number">04</div>
            </div>
            <div className="card">
              <h3>
                Infinity Pool
                <br />
                Lounge
              </h3>
              <p>
                Spend relaxing evenings beside our luxury infinity pools and
                bars.
              </p>
              <div className="number">05</div>
            </div>
            <div className="card">
              <h3>
                Private Beach
                <br />
                Access
              </h3>
              <p>
                Experience crystal-clear beaches with premium private access and
                cabanas.
              </p>
              <div className="number">06</div>
            </div>
            <div className="card">
              <h3>
                Luxury Sunset
                <br />
                Cruises
              </h3>
              <p>
                Discover unforgettable sunset cruises and romantic ocean
                adventures.
              </p>
              <div className="number">07</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Q&A SECTION ========================= */}
      <div className="container1">
        <div className="left">
          <h1 className="hero-title">
            Luxury <span className="bold">escape</span>
            <br />
            for <span className="highlight">every</span>
            <br />
            <span className="bold">traveler</span>
          </h1>
          <div className="video-card">
            <video id="resortVideo" ref={videoRef} autoPlay muted loop>
              <source src="/img/1.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay">
              <div className="video-text">
                Experience breathtaking ocean views, luxury suites, and
                unforgettable moments at AZURE Resort.
              </div>
              <button className="play-btn" id="playBtn" onClick={toggleVideo}>
                {isPlaying ? "❚❚" : "▶"}
              </button>
            </div>
          </div>
        </div>
        <div className="right">
          {/* FAQ Item 1 */}
          <div
            className={`faq-item${activeFaq === 0 ? " active" : ""}`}
            onClick={() => handleFaqClick(0)}
          >
            <div className="faq-header">
              <div className="faq-title">
                <span className="faq-number">01</span> Ocean View Villas
              </div>
              <div className="faq-icon">+</div>
            </div>
            <div className="faq-content">
              <p>
                Private luxury villas with infinity pools, panoramic sea views,
                and personalized room service for ultimate relaxation.
              </p>
              <button className="book-btn">Book Your Stay</button>
            </div>
          </div>
          {/* FAQ Item 2 */}
          <div
            className={`faq-item${activeFaq === 1 ? " active" : ""}`}
            onClick={() => handleFaqClick(1)}
          >
            <div className="faq-header">
              <div className="faq-title">
                <span className="faq-number">02</span> Fine Dining Experience
              </div>
              <div className="faq-icon">+</div>
            </div>
            <div className="faq-content">
              <p>
                Enjoy world-class cuisine prepared by top chefs with exclusive
                beachside dining.
              </p>
            </div>
          </div>
          {/* FAQ Item 3 */}
          <div
            className={`faq-item${activeFaq === 2 ? " active" : ""}`}
            onClick={() => handleFaqClick(2)}
          >
            <div className="faq-header">
              <div className="faq-title">
                <span className="faq-number">03</span> Spa & Wellness Retreat
              </div>
              <div className="faq-icon">+</div>
            </div>
            <div className="faq-content">
              <p>
                Rejuvenate your mind and body with luxury spa therapies and
                wellness programs.
              </p>
            </div>
          </div>
          {/* FAQ Item 4 */}
          <div
            className={`faq-item${activeFaq === 3 ? " active" : ""}`}
            onClick={() => handleFaqClick(3)}
          >
            <div className="faq-header">
              <div className="faq-title">
                <span className="faq-number">04</span> Private Beach Activities
              </div>
              <div className="faq-icon">+</div>
            </div>
            <div className="faq-content">
              <p>
                Enjoy sunset cruises, water sports, and exclusive beach events
                curated for guests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= RESORT BANNER ========================= */}
      <section className="resort-banner">
        <h1 className="resort-heading">
          <span className="thin-text">Experience</span>{" "}
          <span className="bold-text">Luxury</span>{" "}
          <span className="color-text">Resort</span>
        </h1>
        <div className="resort-services">
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Ocean View</span>
          </div>
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Private Villas</span>
          </div>
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Spa & Wellness</span>
          </div>
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Infinity Pool</span>
          </div>
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Fine Dining</span>
          </div>
          <div className="service-box">
            <span className="service-icon">✧</span>
            <span>Beach Access</span>
          </div>
        </div>
      </section>

      {/* ========================= CONTACT SECTION ========================= */}
      <section className="contact-section">
        <div className="left-side">
          <div>
            <p className="small-title">Contact Us</p>
            <h1 className="main-heading">
              Welcome To <br />
              <span>Azure</span> Paradise
            </h1>
            <div className="locations">
              <div className="location-box">
                <h3>Maldives Resort</h3>
                <p>
                  Ocean Breeze Island,
                  <br /> Male 2034
                </p>
              </div>
              <div className="location-box">
                <h3>Dubai Resort</h3>
                <p>
                  Palm Jumeirah,
                  <br /> Dubai Marina
                </p>
              </div>
              <div className="location-box">
                <h3>Swiss Resort</h3>
                <p>
                  Lake View Avenue,
                  <br /> Zurich 8800
                </p>
              </div>
              <div className="location-box">
                <h3>Bali Resort</h3>
                <p>
                  Sunset Beach Road,
                  <br /> Bali 45890
                </p>
              </div>
            </div>
            <h2 className="email">azurecove@gmail.com</h2>
          </div>
        </div>
        <div className="right-side">
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <div className="right-text">
            <p>
              Leave your details and our luxury hospitality team will contact
              you shortly.
            </p>
          </div>
          <form className="contact-form">
            <div className="input-box">
              <input type="text" placeholder="Full Name" />
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email Address" />
            </div>
            <div className="input-box">
              <input type="text" placeholder="Preferred Resort" />
            </div>
            <div className="input-box">
              <input type="date" />
            </div>
            <div className="input-box full-width">
              <textarea placeholder="Tell us about your dream vacation"></textarea>
            </div>
            <div className="full-width">
              <button type="submit" className="submit-btn">
                Send Request
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================= BRAND SECTION ========================= */}
      <section className="brand-section">
        <div className="brand-top">
          <p>© 2025 Azure Cove Resort. All rights reserved.</p>
          <i className="fa-regular fa-gem center-icon"></i>
          <p>Privacy Policy</p>
        </div>
        <h1 className="brand-name">AZURE</h1>
      </section>
    </>
  );
};

export default App;