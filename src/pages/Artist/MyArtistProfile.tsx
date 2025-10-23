import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Upload,
  Edit,
  Plus,
  ExternalLink,
  Eye,
  Trash2,
  Music as MusicIcon,
  TrendingUp,
  Users,
  Headphones,
  Disc,
  Play,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
import { ArtistSong, ArtistAlbum } from "../../lib/types";
import { useQuery } from "@tanstack/react-query";
import artistApi from "@/api/artist";

// Mock data for the logged-in artist
const mockArtistProfile: ArtistProfile = {
  id: "artist1",
  name: "Luna Wave",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  bannerImage:
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200",
  bio: "Luna Wave is an electronic music producer known for blending ambient soundscapes with driving beats. Creating music that transcends boundaries and connects souls.",
  genres: ["Electronic", "Ambient", "Synthwave", "Chillwave"],
  socialLinks: {
    spotify: "https://spotify.com/artist/lunawave",
    youtube: "https://youtube.com/@lunawave",
    instagram: "https://instagram.com/lunawave",
    twitter: "https://twitter.com/lunawave",
  },
  followers: 1250000,
  totalStreams: 45678900,
  monthlyListeners: 892400,
};

const mockArtistSongs: ArtistSong[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Wave",
    artistId: "artist1",
    album: "Neon Nights",
    albumId: "album1",
    duration: 245,
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    audioUrl: "",
    status: "PUBLISHED",
    streams: 5420000,
  },
  {
    id: "3",
    title: "Digital Soul",
    artist: "Luna Wave",
    artistId: "artist1",
    album: "Neon Nights",
    albumId: "album1",
    duration: 312,
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    audioUrl: "",
    status: "PUBLISHED",
    streams: 3890000,
  },
  {
    id: "6",
    title: "Ethereal Echoes",
    artist: "Luna Wave",
    artistId: "artist1",
    album: "Unreleased",
    albumId: "",
    duration: 280,
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    audioUrl: "",
    status: "DRAFT",
    streams: 0,
  },
  {
    id: "7",
    title: "Cosmic Waves",
    artist: "Luna Wave",
    artistId: "artist1",
    album: "Quantum Beats",
    albumId: "album4",
    duration: 195,
    coverImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400",
    audioUrl: "",
    status: "PUBLISHED",
    streams: 2130000,
  },
];

const mockArtistAlbums: ArtistAlbum[] = [
  {
    id: "album1",
    title: "Neon Nights",
    artist: "Luna Wave",
    artistId: "artist1",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    releaseYear: 2024,
    songs: [],
    trackCount: 12,
  },
  {
    id: "album4",
    title: "Quantum Beats",
    artist: "Luna Wave",
    artistId: "artist1",
    coverImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400",
    releaseYear: 2023,
    songs: [],
    trackCount: 10,
  },
  {
    id: "album5",
    title: "Aurora Dreams",
    artist: "Luna Wave",
    artistId: "artist1",
    coverImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    releaseYear: 2022,
    songs: [],
    trackCount: 8,
  },
];

const allGenres = [
  "Electronic",
  "Ambient",
  "Synthwave",
  "Chillwave",
  "Pop",
  "Rock",
  "Hip Hop",
  "Jazz",
  "Classical",
  "R&B",
  "EDM",
  "House",
  "Techno",
];

export const MyArtistProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ArtistProfile>(mockArtistProfile);
  const [songs, setSongs] = useState<ArtistSong[]>(mockArtistSongs);
  const [albums, setAlbums] = useState<ArtistAlbum[]>(mockArtistAlbums);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["artist profile", user?.user.artistId],
    queryFn: () => {
      return artistApi.getMyArtistProfile();
    },
  });
  if (isLoading) return;
  console.log("🚀 ~ MyArtistProfile ~ data:", data);

  // Form states
  const [editForm, setEditForm] = useState({
    name: profile.name,
    bio: profile.bio,
    genres: profile.genres,
    spotify: profile.socialLinks.spotify || "",
    youtube: profile.socialLinks.youtube || "",
    instagram: profile.socialLinks.instagram || "",
    twitter: profile.socialLinks.twitter || "",
  });

  const [songForm, setSongForm] = useState({
    title: "",
    album: "",
    duration: 0,
    status: "DRAFT" as "PUBLISHED" | "DRAFT",
  });

  const [albumForm, setAlbumForm] = useState({
    title: "",
    releaseYear: new Date().getFullYear(),
  });

  // Check if user has artist access
  if (!user || !user.user.artistId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <MusicIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-2">Artist Access Required</h2>
            <p className="text-gray-400 mb-6">
              You need an artist account to access this page. Please contact
              support to upgrade your account.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editForm.name,
      bio: editForm.bio,
      genres: editForm.genres,
      socialLinks: {
        spotify: editForm.spotify,
        youtube: editForm.youtube,
        instagram: editForm.instagram,
        twitter: editForm.twitter,
      },
    });
    setIsEditingProfile(false);
  };

  const handleAddSong = () => {
    const newSong: ArtistSong = {
      id: `song-${Date.now()}`,
      title: songForm.title,
      artist: profile.name,
      artistId: profile.id,
      album: songForm.album || "Single",
      albumId: "",
      duration: songForm.duration,
      coverImage:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audioUrl: "",
      status: songForm.status,
      streams: 0,
    };
    setSongs([...songs, newSong]);
    setIsAddingSong(false);
    setSongForm({ title: "", album: "", duration: 0, status: "DRAFT" });
  };

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  const handleAddAlbum = () => {
    const newAlbum: ArtistAlbum = {
      id: `album-${Date.now()}`,
      title: albumForm.title,
      artist: profile.name,
      artistId: profile.id,
      coverImage:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      releaseYear: albumForm.releaseYear,
      songs: [],
      trackCount: 0,
    };
    setAlbums([...albums, newAlbum]);
    setIsAddingAlbum(false);
    setAlbumForm({ title: "", releaseYear: new Date().getFullYear() });
  };

  const handleGenreToggle = (genre: string) => {
    if (editForm.genres.includes(genre)) {
      setEditForm({
        ...editForm,
        genres: editForm.genres.filter((g) => g !== genre),
      });
    } else {
      setEditForm({ ...editForm, genres: [...editForm.genres, genre] });
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Banner Section */}
      <div className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>

        <button className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-all flex items-center gap-2 border border-gray-700">
          <Upload className="w-4 h-4" />
          Change Banner
        </button>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={profile.image}
              alt={profile.name}
              className="w-40 h-40 rounded-full border-4 border-[#0A0A0A] object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-[#00FF80] p-2 rounded-full hover:bg-[#00FF80]/90 transition-all shadow-[0_0_20px_rgba(0,255,128,0.5)]">
              <Upload className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="px-8 pt-20 pb-8 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-4xl text-white mb-2"
              style={{ fontWeight: "bold" }}
            >
              {profile.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatNumber(profile.followers)} followers
              </span>
              <span>•</span>
              <Badge className="bg-[#00FF80]/10 text-[#00FF80] border-[#00FF80]/20">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Artist Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Artist Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Bio / About</Label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                      placeholder="Tell your fans about yourself..."
                    />
                  </div>
                  <div>
                    <Label className="mb-3 block">
                      Genres (select multiple)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {allGenres.map((genre) => (
                        <Badge
                          key={genre}
                          onClick={() => handleGenreToggle(genre)}
                          className={`cursor-pointer transition-all ${
                            editForm.genres.includes(genre)
                              ? "bg-[#00FF80] text-black hover:bg-[#00FF80]/90"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Spotify URL</Label>
                      <Input
                        value={editForm.spotify}
                        onChange={(e) =>
                          setEditForm({ ...editForm, spotify: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://spotify.com/artist/..."
                      />
                    </div>
                    <div>
                      <Label>YouTube URL</Label>
                      <Input
                        value={editForm.youtube}
                        onChange={(e) =>
                          setEditForm({ ...editForm, youtube: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://youtube.com/@..."
                      />
                    </div>
                    <div>
                      <Label>Instagram URL</Label>
                      <Input
                        value={editForm.instagram}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            instagram: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label>Twitter/X URL</Label>
                      <Input
                        value={editForm.twitter}
                        onChange={(e) =>
                          setEditForm({ ...editForm, twitter: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => navigate(`/artist/${profile.id}`)}
              className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              View as Public
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Phân tích Section */}
        <section>
          <h2
            className="text-2xl text-white mb-6"
            style={{ fontWeight: "bold" }}
          >
            Phân tích
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 border-purple-700/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-1">Lượt nghe</p>
                    <p
                      className="text-3xl text-white"
                      style={{ fontWeight: "bold" }}
                    >
                      {formatNumber(profile.totalStreams)}
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-full">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 border-blue-700/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-1">Người nghe hàng tháng</p>
                    <p
                      className="text-3xl text-white"
                      style={{ fontWeight: "bold" }}
                    >
                      {formatNumber(profile.monthlyListeners)}
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-full">
                    <Headphones className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-[#00FF80]/10 border-[#00FF80]/30 hover:shadow-[0_0_30px_rgba(0,255,128,0.2)] transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-1">Followers</p>
                    <p
                      className="text-3xl text-white"
                      style={{ fontWeight: "bold" }}
                    >
                      {formatNumber(profile.followers)}
                    </p>
                  </div>
                  <div className="bg-[#00FF80]/20 p-4 rounded-full">
                    <Users className="w-8 h-8 text-[#00FF80]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Artist Info Section */}
        <section>
          <h2
            className="text-2xl text-white mb-6"
            style={{ fontWeight: "bold" }}
          >
            Artist Info
          </h2>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Biography</h3>
                <p className="text-white leading-relaxed">{profile.bio}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.genres.map((genre) => (
                    <Badge
                      key={genre}
                      className="bg-[#00FF80]/10 text-[#00FF80] border-[#00FF80]/20"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-3">Social Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {profile.socialLinks.spotify && (
                    <a
                      href={profile.socialLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-white"
                    >
                      <MusicIcon className="w-4 h-4 text-[#00FF80]" />
                      Spotify
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                  {profile.socialLinks.youtube && (
                    <a
                      href={profile.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-white"
                    >
                      <Play className="w-4 h-4 text-red-500" />
                      YouTube
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                  {profile.socialLinks.instagram && (
                    <a
                      href={profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-white"
                    >
                      <ExternalLink className="w-4 h-4 text-pink-500" />
                      Instagram
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-white"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      Twitter/X
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Songs Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white" style={{ fontWeight: "bold" }}>
              My Songs
            </h2>
            <Dialog open={isAddingSong} onOpenChange={setIsAddingSong}>
              <DialogTrigger asChild>
                <Button className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Song
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Song</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Song Title *</Label>
                    <Input
                      value={songForm.title}
                      onChange={(e) =>
                        setSongForm({ ...songForm, title: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter song title"
                    />
                  </div>
                  <div>
                    <Label>Album</Label>
                    <Input
                      value={songForm.album}
                      onChange={(e) =>
                        setSongForm({ ...songForm, album: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Album name (optional)"
                    />
                  </div>
                  <div>
                    <Label>Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={songForm.duration}
                      onChange={(e) =>
                        setSongForm({
                          ...songForm,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={songForm.status}
                      onValueChange={(value: "PUBLISHED" | "DRAFT") =>
                        setSongForm({ ...songForm, status: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Audio File (MP3)</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FF80]/50 transition-all cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        MP3, WAV up to 50MB
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label>Cover Art</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FF80]/50 transition-all cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Click to upload cover image
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddSong}
                      disabled={!songForm.title}
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    >
                      Add Song
                    </Button>
                    <Button
                      onClick={() => setIsAddingSong(false)}
                      className="flex-1 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Album</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Streams</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {songs.map((song) => (
                    <TableRow
                      key={song.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell className="text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={song.coverImage}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span>{song.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {song.album}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(song.duration)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatNumber(song.streams || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            song.status === "PUBLISHED"
                              ? "bg-[#00FF80]/10 text-[#00FF80] border-[#00FF80]/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {song.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-gray-800 hover:bg-gray-700 text-white h-8 px-3"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteSong(song.id)}
                            className="bg-red-900/20 hover:bg-red-900/40 text-red-400 h-8 px-3"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Albums Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-white" style={{ fontWeight: "bold" }}>
              My Albums
            </h2>
            <Dialog open={isAddingAlbum} onOpenChange={setIsAddingAlbum}>
              <DialogTrigger asChild>
                <Button className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Album
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Album Title *</Label>
                    <Input
                      value={albumForm.title}
                      onChange={(e) =>
                        setAlbumForm({ ...albumForm, title: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter album title"
                    />
                  </div>
                  <div>
                    <Label>Release Year</Label>
                    <Input
                      type="number"
                      value={albumForm.releaseYear}
                      onChange={(e) =>
                        setAlbumForm({
                          ...albumForm,
                          releaseYear:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Album Cover</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FF80]/50 transition-all cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Click to upload album cover
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        JPG, PNG (1:1 ratio recommended)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddAlbum}
                      disabled={!albumForm.title}
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    >
                      Create Album
                    </Button>
                    <Button
                      onClick={() => setIsAddingAlbum(false)}
                      className="flex-1 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map((album) => (
              <Card
                key={album.id}
                className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-all group"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center">
                      <Button className="bg-[#00FF80] text-black hover:bg-[#00FF80]/90">
                        <Disc className="w-4 h-4 mr-2" />
                        Manage Tracks
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-white mb-1 truncate">{album.title}</h3>
                  <p className="text-sm text-gray-400">
                    {album.releaseYear} • {album.trackCount} tracks
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
