// mm:MaZUn5xHXZ — Sun* Kudos Live Board mock data
// Source: Figma design content. Replace with real API calls in later phases.

import type { Kudos, Hashtag, Department, LeaderboardEntry, KudosStats, SpotlightNode } from "./types";
import { mockUsers as u } from "./mock-users";

// ---------------------------------------------------------------------------
// Kudos cards (~8 entries, Vietnamese message bodies from design)
// ---------------------------------------------------------------------------

export const mockKudos: Kudos[] = [
  { id: "k1", sender: u[0], receiver: u[1], contentVi: "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cẩn mẫn và tinh thần luôn hỗ trợ đồng đội của bạn. Bạn là nguồn cảm hứng lớn cho cả team!", hashtags: ["#Dedicated", "#Inspiring", "IDOL GIỚI TRẺ"], imageUrls: ["/shared/user-profile.svg", "/shared/user-profile.svg", "/shared/user-profile.svg", "/shared/user-profile.svg", "/shared/user-profile.svg"], likeCount: 1000, likedByMe: false, isOwn: false, postedAt: "10:00 - 10/30/2025" },
  { id: "k2", sender: u[2], receiver: u[3], contentVi: "Chị ơi, cảm ơn chị đã luôn sẵn sàng chia sẻ kinh nghiệm và hỗ trợ em trong những lúc khó khăn nhất. Chị là người mentor tuyệt vời mà em may mắn được làm việc cùng!", hashtags: ["#Teamwork", "#Mentor"], imageUrls: [], likeCount: 256, likedByMe: true, isOwn: false, postedAt: "14:30 - 11/02/2025" },
  { id: "k3", sender: u[4], receiver: u[5], contentVi: "Cảm ơn bạn đã xử lý một mình toàn bộ ticket khó trong sprint vừa rồi. Nhờ bạn mà dự án không bị delay. Bạn thật sự là trụ cột của team!", hashtags: ["#Hero", "#Dedicated", "#Inspiring"], imageUrls: ["/shared/user-profile.svg"], likeCount: 512, likedByMe: false, isOwn: false, postedAt: "09:15 - 11/05/2025" },
  { id: "k4", sender: u[6], receiver: u[7], contentVi: "Cảm ơn anh đã review code cực kỳ kỹ lưỡng và chỉ ra rất nhiều điểm cần cải thiện cho em. Nhờ anh mà chất lượng code của em ngày càng tốt hơn!", hashtags: ["#CodeQuality", "#Mentor"], imageUrls: [], likeCount: 88, likedByMe: false, isOwn: true, postedAt: "16:45 - 11/08/2025" },
  { id: "k5", sender: u[8], receiver: u[9], contentVi: "Cảm ơn bạn đã luôn vui vẻ và tràn đầy năng lượng mỗi ngày, làm cho không khí làm việc của cả team trở nên dễ chịu hơn rất nhiều. Bạn là ánh nắng của văn phòng!", hashtags: ["#Positivity", "#TeamSpirit", "#Inspiring"], imageUrls: ["/shared/user-profile.svg", "/shared/user-profile.svg"], likeCount: 320, likedByMe: true, isOwn: false, postedAt: "08:00 - 11/10/2025" },
  { id: "k6", sender: u[10], receiver: u[11], contentVi: "Cảm ơn chị đã hỗ trợ onboarding và giúp em hiểu rõ hơn về các quy trình của công ty. Nhờ có chị mà những tuần đầu đi làm của em trở nên thật dễ dàng!", hashtags: ["#Onboarding", "#Dedicated"], imageUrls: [], likeCount: 145, likedByMe: false, isOwn: false, postedAt: "11:20 - 11/12/2025" },
  { id: "k7", sender: u[1], receiver: u[0], contentVi: "Bạn đã làm rất tốt trong buổi demo với khách hàng tuần rồi. Khả năng trình bày rõ ràng và xử lý các câu hỏi khó của bạn thực sự ấn tượng!", hashtags: ["#Communication", "#Professional"], imageUrls: ["/shared/user-profile.svg", "/shared/user-profile.svg", "/shared/user-profile.svg"], likeCount: 198, likedByMe: false, isOwn: false, postedAt: "13:00 - 11/15/2025" },
  { id: "k8", sender: u[3], receiver: u[2], contentVi: "Cảm ơn anh đã làm overtime cùng team để hoàn thành milestone đúng hạn. Tinh thần trách nhiệm và sự hi sinh của anh thật sự đáng trân trọng!", hashtags: ["#Dedication", "#Teamwork", "IDOL GIỚI TRẺ"], imageUrls: [], likeCount: 775, likedByMe: true, isOwn: false, postedAt: "17:30 - 11/20/2025" },
];

// ---------------------------------------------------------------------------
// Hashtags & Departments
// ---------------------------------------------------------------------------

export const mockHashtags: Hashtag[] = [
  { id: "h1", label: "#Dedicated", count: 42 },
  { id: "h2", label: "#Inspiring", count: 38 },
  { id: "h3", label: "IDOL GIỚI TRẺ", count: 25 },
  { id: "h4", label: "#Teamwork", count: 31 },
  { id: "h5", label: "#Mentor", count: 18 },
  { id: "h6", label: "#Hero", count: 22 },
  { id: "h7", label: "#Positivity", count: 15 },
];

export const mockDepartments: Department[] = [
  { id: "d1", name: "CEVC10" }, { id: "d2", name: "CEVC03" }, { id: "d3", name: "CEVC07" },
  { id: "d4", name: "CEVC12" }, { id: "d5", name: "CEVC01" }, { id: "d6", name: "CEVC05" },
  { id: "d7", name: "CEVC08" }, { id: "d8", name: "CEVC02" }, { id: "d9", name: "CEVC06" },
  { id: "d10", name: "CEVC04" },
];

// ---------------------------------------------------------------------------
// Leaderboards (10 entries each)
// ---------------------------------------------------------------------------

export const mockLeaderboardRankUp: LeaderboardEntry[] = [
  { user: u[0], description: "+12 hạng" }, { user: u[2], description: "+10 hạng" },
  { user: u[4], description: "+9 hạng" },  { user: u[6], description: "+8 hạng" },
  { user: u[8], description: "+7 hạng" },  { user: u[10], description: "+6 hạng" },
  { user: u[1], description: "+5 hạng" },  { user: u[3], description: "+5 hạng" },
  { user: u[5], description: "+4 hạng" },  { user: u[7], description: "+3 hạng" },
];

export const mockLeaderboardGifts: LeaderboardEntry[] = [
  { user: u[1], description: "3 quà" }, { user: u[3], description: "3 quà" },
  { user: u[5], description: "2 quà" }, { user: u[7], description: "2 quà" },
  { user: u[9], description: "2 quà" }, { user: u[11], description: "1 quà" },
  { user: u[0], description: "1 quà" }, { user: u[2], description: "1 quà" },
  { user: u[4], description: "1 quà" }, { user: u[6], description: "1 quà" },
];

// ---------------------------------------------------------------------------
// Stats (sidebar)
// ---------------------------------------------------------------------------

export const mockStats: KudosStats = {
  received: 25, sent: 25, hearts: 25, boxOpened: 25, boxUnopened: 25,
};

// ---------------------------------------------------------------------------
// Spotlight nodes (~40 names, one highlighted)
// ---------------------------------------------------------------------------

export const mockSpotlightNodes: SpotlightNode[] = [
  { name: "Huỳnh Dương Xuân Nhật", kudosCount: 388, postedAt: "11/20/2025", highlighted: true },
  { name: "Trần Thị Minh Châu", kudosCount: 245, postedAt: "11/18/2025" },
  { name: "Nguyễn Văn Hùng", kudosCount: 198, postedAt: "11/15/2025" },
  { name: "Lê Thị Bảo Ngọc", kudosCount: 176, postedAt: "11/12/2025" },
  { name: "Phạm Hoàng Anh", kudosCount: 154, postedAt: "11/10/2025" },
  { name: "Đặng Thị Ngọc Ánh", kudosCount: 143, postedAt: "11/08/2025" },
  { name: "Vũ Minh Tuấn", kudosCount: 132, postedAt: "11/05/2025" },
  { name: "Bùi Thanh Hà", kudosCount: 121, postedAt: "11/02/2025" },
  { name: "Ngô Trọng Nghĩa", kudosCount: 115, postedAt: "10/30/2025" },
  { name: "Trịnh Thị Lan", kudosCount: 108, postedAt: "10/28/2025" },
  { name: "Đinh Quang Vinh", kudosCount: 97, postedAt: "10/25/2025" },
  { name: "Hoàng Thị Thu Hương", kudosCount: 92, postedAt: "10/22/2025" },
  { name: "Cao Minh Đức", kudosCount: 88, postedAt: "10/20/2025" },
  { name: "Phan Thị Hồng Nhung", kudosCount: 84, postedAt: "10/18/2025" },
  { name: "Lý Văn Phúc", kudosCount: 79, postedAt: "10/15/2025" },
  { name: "Trương Thị Mai", kudosCount: 74, postedAt: "10/12/2025" },
  { name: "Đỗ Quốc Bảo", kudosCount: 70, postedAt: "10/10/2025" },
  { name: "Nguyễn Thị Thanh Thảo", kudosCount: 65, postedAt: "10/08/2025" },
  { name: "Hà Văn Long", kudosCount: 62, postedAt: "10/05/2025" },
  { name: "Võ Thị Cẩm Nhung", kudosCount: 58, postedAt: "10/02/2025" },
  { name: "Lưu Hoàng Khải", kudosCount: 55, postedAt: "09/30/2025" },
  { name: "Dương Thị Phương", kudosCount: 52, postedAt: "09/28/2025" },
  { name: "Tô Minh Khoa", kudosCount: 49, postedAt: "09/25/2025" },
  { name: "Mạc Thị Diệu Linh", kudosCount: 47, postedAt: "09/22/2025" },
  { name: "Trần Quang Hải", kudosCount: 44, postedAt: "09/20/2025" },
  { name: "Bạch Thị Kim Chi", kudosCount: 42, postedAt: "09/18/2025" },
  { name: "Huỳnh Tấn Phát", kudosCount: 39, postedAt: "09/15/2025" },
  { name: "Nguyễn Thị Yến Nhi", kudosCount: 37, postedAt: "09/12/2025" },
  { name: "Chu Văn Khánh", kudosCount: 35, postedAt: "09/10/2025" },
  { name: "Lâm Thị Mỹ Duyên", kudosCount: 33, postedAt: "09/08/2025" },
  { name: "Phùng Hữu Đạt", kudosCount: 31, postedAt: "09/05/2025" },
  { name: "Đinh Thị Lan Hương", kudosCount: 29, postedAt: "09/02/2025" },
  { name: "Tăng Văn Thịnh", kudosCount: 27, postedAt: "08/30/2025" },
  { name: "Trần Thị Thu Trang", kudosCount: 25, postedAt: "08/28/2025" },
  { name: "Lê Hoàng Nam", kudosCount: 24, postedAt: "08/25/2025" },
  { name: "Nguyễn Thị Ngọc Bích", kudosCount: 22, postedAt: "08/22/2025" },
  { name: "Phạm Văn Sơn", kudosCount: 21, postedAt: "08/20/2025" },
  { name: "Đoàn Thị Hải Yến", kudosCount: 19, postedAt: "08/18/2025" },
  { name: "Vương Đình Tuấn", kudosCount: 18, postedAt: "08/15/2025" },
  { name: "Kiều Thị Mỹ Linh", kudosCount: 16, postedAt: "08/12/2025" },
];

// ---------------------------------------------------------------------------
// Total kudos count (design: 388)
// ---------------------------------------------------------------------------

export const totalKudos = 388;

// Re-export users for convenience (downstream phases can import from here)
export { mockUsers } from "./mock-users";
