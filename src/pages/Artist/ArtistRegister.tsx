import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

export const CreateArtistPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user) {
    navigate("/artist-dashboard");
    return null;
  }

  const genres = [
    "Electronic",
    "Synthwave",
    "Bass",
    "Cyberpunk",
    "Techno",
    "House",
    "Trance",
    "Ambient",
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/artist-dashboard");
  };

  return (
    <div className="pb-32 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1
          className="text-5xl text-white mb-4"
          style={{
            textShadow: "0 0 30px rgba(0, 255, 128, 0.5)",
          }}
        >
          🎨 Create Artist Profile
        </h1>
        <p className="text-gray-400 text-lg">
          Join the cyber music revolution and share your creations
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded-2xl p-8 border border-[#00FF80]/20"
        style={{
          boxShadow: "0 10px 60px rgba(0, 255, 128, 0.2)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Artist Name */}
          <div>
            <label className="block text-white mb-3">Artist Name</label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full bg-[#1A1A1A] border-2 border-[#00FF80]/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF80] transition-all"
              placeholder="Enter your artist name"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-white mb-3">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#1A1A1A] border-2 border-[#00FF80]/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF80] transition-all min-h-[120px]"
              placeholder="Tell us about your music journey..."
              required
            />
          </div>

          {/* Genre Tags */}
          <div>
            <label className="block text-white mb-3">Genre Tags</label>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedGenres.includes(genre)
                      ? "bg-[#00FF80] text-black"
                      : "bg-[#1A1A1A] text-gray-400 border border-[#00FF80]/20 hover:border-[#00FF80]/50"
                  }`}
                  style={
                    selectedGenres.includes(genre)
                      ? {
                          boxShadow: "0 0 20px rgba(0, 255, 128, 0.4)",
                        }
                      : {}
                  }
                >
                  {genre}
                  {selectedGenres.includes(genre) && (
                    <X className="w-4 h-4 inline ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Banner */}
          <div>
            <label className="block text-white mb-3">Banner Image</label>
            <div className="border-2 border-dashed border-[#00FF80]/20 rounded-lg p-12 text-center hover:border-[#00FF80]/50 transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-[#00FF80] mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Upload Avatar */}
          <div>
            <label className="block text-white mb-3">Profile Picture</label>
            <div className="border-2 border-dashed border-[#00FF80]/20 rounded-lg p-12 text-center hover:border-[#00FF80]/50 transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-[#00FF80] mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-4 rounded-lg bg-[#00FF80] text-black hover:bg-[#00FF80]/90 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: "0 0 30px rgba(0, 255, 128, 0.6)",
            }}
          >
            Create Artist Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
