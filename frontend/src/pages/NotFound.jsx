import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => (
  <div
    className="min-h-screen flex items-center justify-center text-center px-6"
    style={{ background: "linear-gradient(135deg, #fefae0 0%, #faedcd 100%)" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-9xl font-black mb-4 select-none" style={{ color: "rgba(212,163,115,0.3)" }}>
        404
      </p>
      <h1 className="text-3xl font-bold mb-3" style={{ color: "#3d3522" }}>Page Not Found</h1>
      <p className="mb-8 max-w-sm mx-auto" style={{ color: "#a08c6a" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-premium px-10 py-4">
        Go to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
