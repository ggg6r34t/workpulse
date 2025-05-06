import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <p>WorkPulse Time Tracker &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1 text-muted-foreground/70">
          Track your time efficiently
        </p>
      </div>
    </footer>
  );
};

export default Footer;
