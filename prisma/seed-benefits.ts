import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Benefits page translations
const benefitsContent = {
  en: {
    back: '← Back to Home',
    title: 'Redefining Vitality',
    subtitle: 'Discover how SweetB supports your journey to balanced energy, confidence, and enduring performance.',
    energy: {
      title: 'Energy & Focus',
      p1: 'Experience the difference between forced stimulation and true vitality. SweetB delivers <span class="highlight">clear, sustained energy</span> that flows naturally throughout your day, without the crash or jitters that come from synthetic alternatives.',
      p2: 'Our carefully balanced blend of <strong>Korean Red Ginseng</strong> and <strong>Maca Root</strong> works synergistically to enhance mental clarity and physical stamina. You\'ll notice improved concentration during demanding tasks, sharper decision-making, and the mental endurance to stay focused from morning meetings to evening commitments.',
      p3: 'Unlike caffeine-heavy products that spike and fade, SweetB supports your body\'s natural energy production, helping you maintain <span class="highlight">consistent performance</span> when it matters most.',
    },
    confidence: {
      title: 'Balanced Confidence',
      p1: 'True confidence comes from within — from feeling composed, centered, and in control. SweetB\'s natural ingredients support your body\'s ability to maintain <span class="highlight">emotional equilibrium</span> even in high-pressure situations.',
      p2: 'The <strong>Tongkat Ali</strong> and <strong>Tribulus Terrestris</strong> in our formula have been traditionally used for centuries to promote inner strength and self-assurance. These botanicals work at a foundational level, supporting healthy hormone balance and helping you feel more present, grounded, and ready to engage with the world around you.',
      p3: 'Whether you\'re presenting to a boardroom, navigating social situations, or simply showing up as your best self, SweetB helps you maintain that <span class="highlight">quiet confidence</span> that doesn\'t need to announce itself — it simply is.',
    },
    performance: {
      title: 'Lasting Performance',
      p1: 'Performance isn\'t just about peak moments — it\'s about <span class="highlight">enduring support</span> that carries you through extended periods of physical and mental demand. SweetB\'s effects are designed to last, with benefits that can extend for up to three days.',
      p2: 'The combination of <strong>L-Arginine</strong> and traditional adaptogens promotes healthy circulation and stamina, supporting your body\'s ability to sustain effort over time. This means better endurance during workouts, improved recovery, and the physical resilience to meet life\'s demands without constantly reaching for another boost.',
      p3: 'Whether you\'re an athlete pushing your limits, a professional navigating long workdays, or simply someone who values <span class="highlight">steady, reliable vitality</span>, SweetB provides the foundation for lasting performance.',
    },
    discreet: {
      title: 'Discreet & Convenient',
      p1: 'In a world that demands your attention at every turn, wellness should be <span class="highlight">simple, not complicated</span>. SweetB strips away the excess — no pills to swallow, no powders to mix, no elaborate routines to follow.',
      p2: 'Just one discreet candy, taken once daily. It fits seamlessly into your life, whether you\'re at home, at work, or on the move. The elegant formulation means you can maintain your wellness practice without drawing attention or disrupting your day. No one needs to know about your personal choices for vitality.',
      p3: 'This is <span class="highlight">refined simplicity</span> — sophisticated support that respects your time, your privacy, and your preference for understated excellence. Take it in the morning with your coffee, before an important meeting, or whenever you choose. SweetB adapts to your lifestyle, not the other way around.',
    },
    final: {
      title: 'Experience the Difference',
      text: 'These benefits work together, creating a foundation for vitality that supports every aspect of your life. From morning clarity to evening confidence, SweetB is your quiet companion in the pursuit of balanced, enduring wellness.',
      shopButton: 'Shop SweetB',
      storyButton: 'Our Story',
    },
  },
  ms: {
    back: '← Kembali ke Laman Utama',
    title: 'Mentakrifkan Semula Vitaliti',
    subtitle: 'Temui bagaimana SweetB menyokong perjalanan anda ke arah tenaga seimbang, keyakinan, dan prestasi yang berkekalan.',
    energy: {
      title: 'Tenaga & Fokus',
      p1: 'Alami perbezaan antara rangsangan paksa dan vitaliti sebenar. SweetB memberikan <span class="highlight">tenaga yang jelas dan berterusan</span> yang mengalir secara semula jadi sepanjang hari anda, tanpa kemerosotan atau kegelisahan yang datang dari alternatif sintetik.',
      p2: 'Campuran seimbang kami yang terdiri daripada <strong>Ginseng Merah Korea</strong> dan <strong>Akar Maca</strong> bekerjasama secara sinergistik untuk meningkatkan kejelasan mental dan stamina fizikal. Anda akan perhatikan peningkatan tumpuan semasa tugas yang mencabar, membuat keputusan yang lebih tajam, dan daya tahan mental untuk kekal fokus dari mesyuarat pagi hingga komitmen petang.',
      p3: 'Tidak seperti produk yang tinggi kafein yang naik dan turun, SweetB menyokong pengeluaran tenaga semula jadi badan anda, membantu anda mengekalkan <span class="highlight">prestasi yang konsisten</span> apabila ia paling penting.',
    },
    confidence: {
      title: 'Keyakinan Seimbang',
      p1: 'Keyakinan sebenar datang dari dalam — dari perasaan tenang, berpusat, dan terkawal. Bahan semula jadi SweetB menyokong keupayaan badan anda untuk mengekalkan <span class="highlight">keseimbangan emosi</span> walaupun dalam situasi bertekanan tinggi.',
      p2: '<strong>Tongkat Ali</strong> dan <strong>Tribulus Terrestris</strong> dalam formula kami telah digunakan secara tradisional selama berabad-abad untuk mempromosikan kekuatan dalaman dan keyakinan diri. Botani ini berfungsi pada tahap asas, menyokong keseimbangan hormon yang sihat dan membantu anda merasa lebih hadir, berakar, dan bersedia untuk terlibat dengan dunia di sekitar anda.',
      p3: 'Sama ada anda membentangkan kepada bilik mesyuarat, menavigasi situasi sosial, atau sekadar muncul sebagai diri terbaik anda, SweetB membantu anda mengekalkan <span class="highlight">keyakinan yang tenang</span> yang tidak perlu mengumumkan dirinya — ia hanya wujud.',
    },
    performance: {
      title: 'Prestasi Berkekalan',
      p1: 'Prestasi bukan hanya tentang saat puncak — ia tentang <span class="highlight">sokongan yang berkekalan</span> yang membawa anda melalui tempoh permintaan fizikal dan mental yang berpanjangan. Kesan SweetB direka untuk bertahan, dengan faedah yang boleh berpanjangan sehingga tiga hari.',
      p2: 'Gabungan <strong>L-Arginine</strong> dan adaptogen tradisional mempromosikan peredaran dan stamina yang sihat, menyokong keupayaan badan anda untuk mengekalkan usaha dari masa ke masa. Ini bermakna daya tahan yang lebih baik semasa senaman, pemulihan yang lebih baik, dan ketahanan fizikal untuk memenuhi tuntutan hidup tanpa sentiasa mencari rangsangan lain.',
      p3: 'Sama ada anda seorang atlet yang menolak had anda, seorang profesional yang menavigasi hari kerja yang panjang, atau sekadar seseorang yang menghargai <span class="highlight">vitaliti yang stabil dan boleh dipercayai</span>, SweetB menyediakan asas untuk prestasi yang berkekalan.',
    },
    discreet: {
      title: 'Diskret & Mudah',
      p1: 'Dalam dunia yang menuntut perhatian anda pada setiap masa, kesejahteraan sepatutnya <span class="highlight">mudah, bukan rumit</span>. SweetB menghilangkan yang berlebihan — tiada pil untuk ditelan, tiada serbuk untuk dicampur, tiada rutin rumit untuk diikuti.',
      p2: 'Hanya satu gula-gula diskret, diambil sekali sehari. Ia sesuai dengan kehidupan anda, sama ada anda di rumah, di tempat kerja, atau dalam perjalanan. Formulasi yang elegan bermakna anda boleh mengekalkan amalan kesejahteraan anda tanpa menarik perhatian atau mengganggu hari anda. Tiada siapa yang perlu tahu tentang pilihan peribadi anda untuk vitaliti.',
      p3: 'Ini adalah <span class="highlight">kesederhanaan yang halus</span> — sokongan canggih yang menghormati masa anda, privasi anda, dan pilihan anda untuk kecemerlangan yang rendah hati. Ambil pada waktu pagi dengan kopi anda, sebelum mesyuarat penting, atau bila-bila masa anda pilih. SweetB menyesuaikan dengan gaya hidup anda, bukan sebaliknya.',
    },
    final: {
      title: 'Alami Perbezaannya',
      text: 'Faedah-faedah ini bekerjasama, mewujudkan asas untuk vitaliti yang menyokong setiap aspek kehidupan anda. Dari kejelasan pagi hingga keyakinan petang, SweetB adalah rakan senyap anda dalam mengejar kesejahteraan yang seimbang dan berkekalan.',
      shopButton: 'Beli SweetB',
      storyButton: 'Cerita Kami',
    },
  },
  'zh-CN': {
    back: '← 返回首页',
    title: '重新定义活力',
    subtitle: '了解 SweetB 如何支持您实现平衡能量、自信和持久表现的旅程。',
    energy: {
      title: '能量与专注',
      p1: '体验强制刺激与真正活力之间的区别。SweetB 提供 <span class="highlight">清晰、持续的能量</span>，自然地在您的一天中流动，没有合成替代品带来的崩溃或紧张感。',
      p2: '我们精心平衡的 <strong>韩国红参</strong> 和 <strong>玛卡根</strong> 混合物协同作用，增强心理清晰度和身体耐力。您会注意到在要求高的任务中注意力提高，决策更敏锐，以及从早会到晚间承诺保持专注的心理耐力。',
      p3: '与那些飙升和消退的高咖啡因产品不同，SweetB 支持您身体的自然能量产生，帮助您在最重要的时候保持 <span class="highlight">一致的性能</span>。',
    },
    confidence: {
      title: '平衡自信',
      p1: '真正的自信来自内心——来自感到镇定、集中和控制。SweetB 的天然成分支持您的身体在高压情况下保持 <span class="highlight">情绪平衡</span> 的能力。',
      p2: '我们配方中的 <strong>东革阿里</strong> 和 <strong>蒺藜</strong> 传统上已被使用了几个世纪，以促进内在力量和自信。这些植物在基础层面发挥作用，支持健康的激素平衡，帮助您感到更加存在、扎根，并准备好与周围的世界互动。',
      p3: '无论您是在会议室做演示、应对社交场合，还是简单地展现最好的自己，SweetB 帮助您保持那种 <span class="highlight">安静的自信</span>，它不需要宣布自己——它只是存在。',
    },
    performance: {
      title: '持久表现',
      p1: '表现不仅仅是关于巅峰时刻——它是关于 <span class="highlight">持久的支持</span>，让您度过长时间的身体和心理需求。SweetB 的效果设计为持久，益处可延长至三天。',
      p2: '<strong>L-精氨酸</strong> 和传统适应原的组合促进健康的循环和耐力，支持您的身体随时间持续努力的能力。这意味着在锻炼期间更好的耐力、改善的恢复，以及满足生活需求的物理韧性，而无需不断寻求另一个提升。',
      p3: '无论您是推动极限的运动员、应对漫长工作日的专业人士，还是只是重视 <span class="highlight">稳定、可靠的活力</span> 的人，SweetB 为持久表现提供了基础。',
    },
    discreet: {
      title: '低调便捷',
      p1: '在一个在每个转折点都要求您注意的世界中，健康应该是 <span class="highlight">简单，而不是复杂</span>。SweetB 去除了多余的东西——无需吞咽药丸，无需混合粉末，无需遵循复杂的程序。',
      p2: '只需一颗低调的糖果，每天一次。它无缝融入您的生活，无论您是在家、在工作，还是在旅途中。优雅的配方意味着您可以保持健康实践，而不会引起注意或扰乱您的一天。没有人需要知道您对活力的个人选择。',
      p3: '这是 <span class="highlight">精致的简单</span>——尊重您的时间、隐私和对低调卓越偏好的复杂支持。在早上与咖啡一起服用，在重要会议之前，或无论何时您选择。SweetB 适应您的生活方式，而不是相反。',
    },
    final: {
      title: '体验差异',
      text: '这些益处共同作用，为支持您生活各个方面的活力创造基础。从早晨的清晰到晚上的自信，SweetB 是您在追求平衡、持久健康过程中的安静伴侣。',
      shopButton: '购买 SweetB',
      storyButton: '我们的故事',
    },
  },
}

async function main() {
  console.log('💪 Seeding benefits page translations...')

  for (const [lang, content] of Object.entries(benefitsContent)) {
    // Basic page content
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.back', language: lang as any } },
      update: { value: content.back, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.back', language: lang as any, value: content.back, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.title', language: lang as any } },
      update: { value: content.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.title', language: lang as any, value: content.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.subtitle', language: lang as any } },
      update: { value: content.subtitle, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.subtitle', language: lang as any, value: content.subtitle, type: 'TEXT', page: 'benefits' },
    })

    // Energy section
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.energy.title', language: lang as any } },
      update: { value: content.energy.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.energy.title', language: lang as any, value: content.energy.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.energy.p1', language: lang as any } },
      update: { value: content.energy.p1, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.energy.p1', language: lang as any, value: content.energy.p1, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.energy.p2', language: lang as any } },
      update: { value: content.energy.p2, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.energy.p2', language: lang as any, value: content.energy.p2, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.energy.p3', language: lang as any } },
      update: { value: content.energy.p3, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.energy.p3', language: lang as any, value: content.energy.p3, type: 'TEXT', page: 'benefits' },
    })

    // Confidence section
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.confidence.title', language: lang as any } },
      update: { value: content.confidence.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.confidence.title', language: lang as any, value: content.confidence.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.confidence.p1', language: lang as any } },
      update: { value: content.confidence.p1, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.confidence.p1', language: lang as any, value: content.confidence.p1, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.confidence.p2', language: lang as any } },
      update: { value: content.confidence.p2, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.confidence.p2', language: lang as any, value: content.confidence.p2, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.confidence.p3', language: lang as any } },
      update: { value: content.confidence.p3, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.confidence.p3', language: lang as any, value: content.confidence.p3, type: 'TEXT', page: 'benefits' },
    })

    // Performance section
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.performance.title', language: lang as any } },
      update: { value: content.performance.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.performance.title', language: lang as any, value: content.performance.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.performance.p1', language: lang as any } },
      update: { value: content.performance.p1, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.performance.p1', language: lang as any, value: content.performance.p1, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.performance.p2', language: lang as any } },
      update: { value: content.performance.p2, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.performance.p2', language: lang as any, value: content.performance.p2, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.performance.p3', language: lang as any } },
      update: { value: content.performance.p3, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.performance.p3', language: lang as any, value: content.performance.p3, type: 'TEXT', page: 'benefits' },
    })

    // Discreet section
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.discreet.title', language: lang as any } },
      update: { value: content.discreet.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.discreet.title', language: lang as any, value: content.discreet.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.discreet.p1', language: lang as any } },
      update: { value: content.discreet.p1, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.discreet.p1', language: lang as any, value: content.discreet.p1, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.discreet.p2', language: lang as any } },
      update: { value: content.discreet.p2, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.discreet.p2', language: lang as any, value: content.discreet.p2, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.discreet.p3', language: lang as any } },
      update: { value: content.discreet.p3, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.discreet.p3', language: lang as any, value: content.discreet.p3, type: 'TEXT', page: 'benefits' },
    })

    // Final section
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.final.title', language: lang as any } },
      update: { value: content.final.title, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.final.title', language: lang as any, value: content.final.title, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.final.text', language: lang as any } },
      update: { value: content.final.text, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.final.text', language: lang as any, value: content.final.text, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.final.shopButton', language: lang as any } },
      update: { value: content.final.shopButton, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.final.shopButton', language: lang as any, value: content.final.shopButton, type: 'TEXT', page: 'benefits' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'benefits.final.storyButton', language: lang as any } },
      update: { value: content.final.storyButton, type: 'TEXT', page: 'benefits' },
      create: { key: 'benefits.final.storyButton', language: lang as any, value: content.final.storyButton, type: 'TEXT', page: 'benefits' },
    })
  }

  console.log('✨ Benefits page translations seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

