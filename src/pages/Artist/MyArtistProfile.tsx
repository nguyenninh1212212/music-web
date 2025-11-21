import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Upload, Edit, Plus, Eye, Trash2, Users, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
// SỬA: Import đúng types từ file types.ts
import { IArtist, ISongSummary, IAlbumSummary } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import artistApi from "@/api/artist";
import { toast } from "sonner";
import albumApi from "@/api/album"; // SỬA: Thêm import albumApi
import { AlbumCard } from "@/components/AlbumCard";
import { useSong } from "@/lib/hook/useSong";
import DialogTrashSongs from "@/components/DialogTrashSongs";

interface ArtistProfile extends IArtist {
  name: string; // IArtist có stageName, nhưng component dùng .name
  followers: number;
  totalStreams: number;
  monthlyListeners: number;
  bannerImage: string;
  image: string;
  genres: string[];
  followerCount: number;
  socialLinks: {
    spotify: string;
    youtube: string;
    instagram: string;
    twitter: string;
  };
}

export const MyArtistProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // SỬA: Khởi tạo queryClient

  // SỬA: Xóa các useState cho profile, songs, albums

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);

  // SỬA: Thêm state cho file uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songCoverFile, setSongCoverFile] = useState<File | null>(null);
  const [albumCoverFile, setAlbumCoverFile] = useState<File | null>(null);

  const { createSong, removeSong } = useSong();

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artist profile", user?.user.artistId],
    queryFn: artistApi.getMyArtistProfile,
    enabled: !!user?.user.artistId, // Chỉ chạy query khi có artistId
  });
  console.log("🚀 ~ MyArtistProfile ~ profileResponse:", profileResponse);

  // SỬA: Khởi tạo form rỗng, sẽ điền dữ liệu sau bằng useEffect
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    genres: [] as string[],
    spotify: "",
    youtube: "",
    instagram: "",
    twitter: "",
  });

  const [songForm, setSongForm] = useState({
    title: "",
    duration: 0,
    status: "DRAFT" as "PUBLISHED" | "DRAFT",
  });

  const [albumForm, setAlbumForm] = useState({
    title: "",
    releaseYear: new Date().getFullYear(),
  });

  // SỬA: Dùng useEffect để cập nhật form an toàn sau khi data đã tải
  useEffect(() => {
    // profileResponse.data là dữ liệu trả về từ API (IArtist)
    if (profileResponse?.data) {
      const profile: ArtistProfile = profileResponse.data as any; // Tạm thời dùng 'any'
      setEditForm({
        name: profile.name || "",
        bio: profile.bio || "",
        genres: profile.genres || [],
        spotify: profile.socialLinks?.spotify || "",
        youtube: profile.socialLinks?.youtube || "",
        instagram: profile.socialLinks?.instagram || "",
        twitter: profile.socialLinks?.twitter || "",
      });
    }
  }, [profileResponse]); // Chạy lại khi 'profileResponse' thay đổi

  // SỬA: Định nghĩa các mutation ở cấp cao nhất

  // Mutation để CẬP NHẬT PROFILE
  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => artistApi.updateArtistProfile(formData),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["artist profile", user?.user.artistId],
      });
      setIsEditingProfile(false);
      setAvatarFile(null);
      setBannerFile(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  // Mutation để TẠO ALBUM MỚI
  const createAlbumMutation = useMutation({
    mutationFn: (formData: FormData) => albumApi.createAlbum(formData),
    onSuccess: () => {
      toast.success("Album created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["artist profile", user?.user.artistId],
      });
      setIsAddingAlbum(false);
      setAlbumForm({ title: "", releaseYear: new Date().getFullYear() });
      setAlbumCoverFile(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to create album: ${error.message}`);
    },
  });

  // SỬA: Sửa các hàm Handler để gọi mutation

  const handleSaveProfile = () => {
    // Dựa trên artist.ts (IArtistCreate)
    const formData = new FormData();
    formData.append("stageName", editForm.name);
    formData.append("bio", editForm.bio);
    formData.append("youtubeUrl", editForm.youtube);
    formData.append("instagramUrl", editForm.instagram);

    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }
    if (bannerFile) {
      formData.append("bannerFile", bannerFile);
    }

    updateProfileMutation.mutate(formData);
  };

  const handleAddSong = async () => {
    if (!songForm.title || !songFile || !songCoverFile) {
      return toast.error("Title, audio file, and cover file are required.");
    }

    const formData = new FormData();
    formData.append("title", songForm.title);
    formData.append("songFile", songFile);
    formData.append("coverFile", songCoverFile);

    createSong.mutateAsync(formData);
  };

  const handleDeleteSong = (id: string) => {
    // TODO: Thêm dialog xác nhận ở đây
    if (
      window.confirm("Are you sure you want to permanently delete this song?")
    ) {
      removeSong.mutate(id);
    }
  };

  const handleAddAlbum = () => {
    if (!albumForm.title || !albumCoverFile) {
      return toast.error("Title and cover file are required.");
    }

    const formData = new FormData();
    formData.append("title", albumForm.title);
    formData.append("coverFile", albumCoverFile);

    createAlbumMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-white">Loading artist profile...</div>;
  }

  // Xử lý không phải artist
  if (!user || !user.user.artistId) {
  }

  // Xử lý lỗi
  if (isError || !profileResponse?.data) {
    toast.error("Failed to load artist profile.");
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl text-white mb-2">Error</h2>
            <p className="text-gray-400 mb-6">
              Could not load your artist profile. Please try again later.
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

  const profile: ArtistProfile = profileResponse.data.artistJson as any;
  const songs: ISongSummary[] = profile.songs || [];
  const albums: IAlbumSummary[] = profile.albums || [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Banner Section */}
      <div className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>

        {/* SỬA: Input thay đổi banner */}
        <Label
          htmlFor="banner-upload"
          className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-all flex items-center gap-2 border border-gray-700 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Change Banner
        </Label>
        <Input
          id="banner-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files && setBannerFile(e.target.files[0])}
        />

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.stageName}
              className="w-40 h-40 rounded-full border-4 border-[#0A0A0A] object-cover"
            />
            <Label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-[#00FF80] p-2 rounded-full hover:bg-[#00FF80]/90 transition-all shadow-[0_0_20px_rgba(0,255,128,0.5)] cursor-pointer"
            >
              <Upload className="w-4 h-4 text-black" />
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setAvatarFile(e.target.files[0])
              }
            />
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
              {profile.stageName}
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatNumber(profile.followerCount || 0)} followers
              </span>
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
                  {/* ... (Các Input của form edit) ... */}
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
                  {/* ... (Các trường khác: bio, genres, social links) ... */}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending} // SỬA: Thêm trạng thái disabled
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    >
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
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
                    <Label>Audio File (MP3) *</Label>
                    <Input
                      type="file"
                      accept="audio/mpeg"
                      onChange={(e) =>
                        e.target.files && setSongFile(e.target.files[0])
                      }
                      className="bg-gray-800 border-gray-700 text-white file:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700"
                    />
                  </div>

                  <div>
                    <Label>Cover Art *</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && setSongCoverFile(e.target.files[0])
                      }
                      className="bg-gray-800 border-gray-700 text-white file:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddSong}
                      disabled={
                        !songForm.title ||
                        !songFile ||
                        !songCoverFile ||
                        createSong.isPending // <-- dùng isLoading
                      }
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)] flex justify-center items-center"
                    >
                      {createSong.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        "Add Song"
                      )}
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
                <TableBody>
                  {songs.map((song) => (
                    <TableRow
                      key={song.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell className="text-right">
                        <div className="flex items-center justify-between gap-2">
                          <div className=" flex text-white items-center gap-4 w-1/3">
                            <img
                              src={`${song.coverImage}`}
                              alt=""
                              className="w-14 h-14"
                            />
                            <p className="text-center">{song.title}</p>
                          </div>
                          <div className="text-white w-20 flex gap-2">
                            <p>Lượt nghe :</p>
                            <p className="text-center text-slate-300">
                              {" "}
                              {song.view}
                            </p>
                          </div>
                          <div>
                            <Button
                              size="sm"
                              className="bg-gray-800 hover:bg-gray-700 text-white h-8 px-3"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteSong(song.id)}
                              disabled={
                                removeSong.isPending &&
                                removeSong.variables === song.id
                              }
                              className="bg-red-900/20 hover:bg-red-900/40 text-red-400 h-8 px-3"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
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
                  {/* ... (Input năm phát hành) ... */}

                  {/* SỬA: Input cho Album Cover */}
                  <div>
                    <Label>Album Cover *</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && setAlbumCoverFile(e.target.files[0])
                      }
                      className="bg-gray-800 border-gray-700 text-white file:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddAlbum}
                      disabled={
                        !albumForm.title ||
                        !albumCoverFile ||
                        createAlbumMutation.isPending
                      }
                      className="flex-1 bg-[#00FF80] text-black hover:bg-[#00FF80]/90 shadow-[0_0_20px_rgba(0,255,128,0.3)]"
                    >
                      {createAlbumMutation.isPending
                        ? "Creating..."
                        : "Create Album"}
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
            {/* SỬA: Map qua 'albums' (lấy từ query) */}
            {albums.map((album) => (
              <AlbumCard album={album} key={album.id} />
            ))}
          </div>
        </section>
        <section className="text-white">
          Bài hát đã xóa: <DialogTrashSongs />
        </section>
      </div>
    </div>
  );
};
