import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Youtube,
  Facebook,
  Instagram,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface FormData {
  stageName: string;
  bio: string;
  avatar: File | null;
  banner: File | null;
  youtube: string;
  facebook: string;
  instagram: string;
  platforms: string[];
}

const platformOptions = [
  "Spotify",
  "Apple Music",
  "SoundCloud",
  "YouTube Music",
  "Zing MP3",
];

const ArtistRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    stageName: "",
    bio: "",
    avatar: null,
    banner: null,
    youtube: "",
    facebook: "",
    instagram: "",
    platforms: [],
  });

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (type: "avatar" | "banner", file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") {
          setAvatarPreview(reader.result as string);
          setFormData((prev) => ({ ...prev, avatar: file }));
        } else {
          setBannerPreview(reader.result as string);
          setFormData((prev) => ({ ...prev, banner: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.stageName.trim()) {
      newErrors.stageName = "Tên nghệ danh là bắt buộc";
    }

    if (!formData.avatar) {
      newErrors.avatar = "Ảnh đại diện là bắt buộc";
    }

    if (!formData.banner) {
      newErrors.banner = "Ảnh bìa là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00FF80] opacity-10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FF80] opacity-10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-8 text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-white to-[#00FF80] bg-clip-text text-transparent">
            Đăng ký trở thành Nghệ sĩ
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Tạo hồ sơ nghệ sĩ của bạn để chia sẻ âm nhạc và NFT với người hâm
            mộ.
          </p>
        </motion.div>

        {/* Main form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Stage Name */}
              <div className="space-y-2">
                <Label htmlFor="stageName" className="text-white/90">
                  Tên nghệ danh <span className="text-[#00FF80]">*</span>
                </Label>
                <Input
                  id="stageName"
                  value={formData.stageName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stageName: e.target.value,
                    }))
                  }
                  placeholder="VD: Sơn Tùng M-TP"
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00FF80] focus:ring-[#00FF80]/20 transition-all ${
                    errors.stageName ? "border-red-500" : ""
                  }`}
                />
                {errors.stageName && (
                  <p className="text-red-400 text-sm">{errors.stageName}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white/90">
                  Giới thiệu bản thân
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Giới thiệu ngắn về bạn và phong cách âm nhạc..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00FF80] focus:ring-[#00FF80]/20 transition-all resize-none"
                />
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label className="text-white/90">
                  Ảnh đại diện <span className="text-[#00FF80]">*</span>
                </Label>
                <div className="flex items-center gap-6">
                  <div
                    className={`w-24 h-24 rounded-full bg-white/5 border-2 ${
                      errors.avatar ? "border-red-500" : "border-white/10"
                    } overflow-hidden flex items-center justify-center`}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-white/30" />
                    )}
                  </div>
                  <label htmlFor="avatar-upload">
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("avatar", e.target.files?.[0] || null)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 hover:border-[#00FF80] transition-all"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Tải ảnh đại diện lên
                    </Button>
                  </label>
                </div>
                {errors.avatar && (
                  <p className="text-red-400 text-sm">{errors.avatar}</p>
                )}
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label className="text-white/90">
                  Ảnh bìa <span className="text-[#00FF80]">*</span>
                </Label>
                <div className="space-y-4">
                  <div
                    className={`w-full h-48 rounded-2xl bg-white/5 border-2 ${
                      errors.banner ? "border-red-500" : "border-white/10"
                    } overflow-hidden flex items-center justify-center`}
                  >
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-12 h-12 text-white/30" />
                    )}
                  </div>
                  <label htmlFor="banner-upload">
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("banner", e.target.files?.[0] || null)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5 hover:border-[#00FF80] transition-all"
                      onClick={() =>
                        document.getElementById("banner-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Tải ảnh bìa lên
                    </Button>
                  </label>
                </div>
                {errors.banner && (
                  <p className="text-red-400 text-sm">{errors.banner}</p>
                )}
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <Label className="text-white/90">Liên kết mạng xã hội</Label>

                {/* YouTube */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-sm">YouTube</span>
                  </div>
                  <Input
                    value={formData.youtube}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        youtube: e.target.value,
                      }))
                    }
                    placeholder="https://youtube.com/@your-channel"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00FF80] focus:ring-[#00FF80]/20 transition-all"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Facebook</span>
                  </div>
                  <Input
                    value={formData.facebook}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        facebook: e.target.value,
                      }))
                    }
                    placeholder="https://facebook.com/yourpage"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00FF80] focus:ring-[#00FF80]/20 transition-all"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/70">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">Instagram</span>
                  </div>
                  <Input
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instagram: e.target.value,
                      }))
                    }
                    placeholder="https://instagram.com/yourprofile"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00FF80] focus:ring-[#00FF80]/20 transition-all"
                  />
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <Label className="text-white/90">
                  Nền tảng bạn muốn xuất hiện
                </Label>
                <div className="space-y-3">
                  {platformOptions.map((platform) => (
                    <div key={platform} className="flex items-center space-x-3">
                      <Checkbox
                        id={platform}
                        checked={formData.platforms.includes(platform)}
                        onCheckedChange={() => togglePlatform(platform)}
                        className="border-white/20 data-[state=checked]:bg-[#00FF80] data-[state=checked]:border-[#00FF80]"
                      />
                      <label
                        htmlFor={platform}
                        className="text-white/80 cursor-pointer select-none"
                      >
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Note */}
              <div className="bg-[#00FF80]/10 border border-[#00FF80]/20 rounded-xl p-4">
                <p className="text-[#00FF80] text-sm">
                  ✓ Tài khoản của bạn sẽ được xác minh trước khi chính thức trở
                  thành nghệ sĩ.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00FF80] hover:bg-[#00FF80]/90 text-black shadow-lg shadow-[#00FF80]/20 hover:shadow-[#00FF80]/40 transition-all duration-300 h-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu xét duyệt"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-2">
              <div className="w-16 h-16 bg-[#00FF80]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-[#00FF80] rounded-full flex items-center justify-center">
                  <span className="text-black">✓</span>
                </div>
              </div>
              Thành công!
            </DialogTitle>
            <DialogDescription className="text-white/70 text-center">
              Yêu cầu đăng ký nghệ sĩ của bạn đã được gửi! Chúng tôi sẽ phản hồi
              sớm nhất có thể.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-[#00FF80] hover:bg-[#00FF80]/90 text-black mt-4"
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistRegistrationForm;
