// mm:3204:10152
// RootFurtherContent — decorative ROOT/FURTHER typography + paragraphs + quote block (B4)

import Image from "next/image";

export function RootFurtherContent() {
  return (
    // mm:3204:10152
    <div
      className="flex flex-col items-center w-full mx-auto"
      style={{
        maxWidth: 1152,
        padding: "120px 104px",
        gap: 32,
        borderRadius: 8,
        justifyContent: "center",
      }}
    >
      {/* mm:3204:10153 — Group 434: ROOT + FURTHER decorative text images stacked */}
      <div
        className="relative flex-shrink-0"
        style={{ width: 290, height: 134 }}
      >
        {/* mm:3204:10155 — "ROOT" text image */}
        <Image
          src="/homepage/root-text.png"
          alt="ROOT"
          width={189}
          height={67}
          className="absolute"
          style={{ top: 0, left: 51 }}
        />
        {/* mm:3204:10154 — "FURTHER" text image */}
        <Image
          src="/homepage/further-text.png"
          alt="FURTHER"
          width={290}
          height={67}
          className="absolute"
          style={{ top: 67, left: 0 }}
        />
      </div>

      {/* mm:5001:14827 — mms_B4_content: paragraphs + quote */}
      <div
        className="flex flex-col w-full"
        style={{ gap: 0 }}
      >
        {/* mm:3204:10156 — first paragraph block */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "justify",
            marginBottom: 32,
          }}
        >
          Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là &ldquo;problem-solver&rdquo; - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.
          {" "}Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, &ldquo;Root Further&rdquo; đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.
          {" "}Vượt ra khỏi nét nghĩa bề mặt, &ldquo;Root Further&rdquo; chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng &ldquo;địa chất&rdquo; ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp &ldquo;trầm tích&rdquo; để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang &ldquo;hấp thụ&rdquo; dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ &ldquo;bén rễ&rdquo; vào kỷ nguyên AI - một tầng &ldquo;địa chất&rdquo; hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.
        </p>

        {/* mm:3204:10161 — quote */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          &ldquo;A tree with deep roots fears no storm&rdquo;
          <br />
          (Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)
        </p>

        {/* mm:3204:10162 — second paragraph block */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "justify",
          }}
        >
          Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, &ldquo;Root Further&rdquo; còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.
          {" "}Không ai biết trước ẩn sâu trong &ldquo;lòng đất&rdquo; của ngành công nghệ và thị trường hiện đại còn biết bao tầng &ldquo;địa chất&rdquo; bí ẩn. Chỉ biết rằng khi &ldquo;Root Further&rdquo; đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.
        </p>
      </div>
    </div>
  );
}
