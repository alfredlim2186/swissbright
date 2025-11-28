import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// About page translations
const aboutContent = {
  en: {
    back: '← Back to Home',
    title: 'The Legend of Candy B',
    origin: {
      title: 'The Origin',
      p1: 'High in the mountains of Peru, where the clouds hang low and the wind smells of wild herbs, a quiet tradition began. Local healers studied the plants that grew in that rare altitude, learning which roots restored strength, which leaves eased the mind, and which barks rekindled the body\'s fire.',
      p2: 'From their hands came a blend that would later be known as <span class="highlight">Formula B</span>.',
    },
    nature: {
      title: 'Nature\'s Wisdom',
      p1: 'The formula was born from nature itself. Ginseng-like roots offered sustained energy, while gentle tonics balanced the heart and spirit. Each component was gathered by hand and prepared with care, using methods that preserved the natural potency of the herbs.',
      p2: 'The result was something powerful yet calm, a source of vitality that felt deeply human.',
    },
    heritage: {
      title: 'Fifty Years of Heritage',
      p1: 'For more than fifty years, this secret was guarded within a small Peruvian family. It was refined slowly, protected as both a craft and a calling.',
      p2: 'To them, it was never just a supplement, but a way of honoring the balance between human strength and nature\'s rhythm.',
    },
    modern: {
      title: 'Modern Evolution',
      p1: 'When science finally met this heritage, the formula found a new expression. The wisdom of those herbalists inspired <span class="highlight">SweetB</span>, a discreet candy shaped for modern life but rooted in ancient knowledge.',
      p2: 'Each piece carries the same promise of renewal, made from natural herbs and pure ingredients that support energy, stamina, and focus without force.',
    },
    final: {
      title: 'From the Andes to You',
      text: 'What began as a whisper in the Andes now lives on as a quiet act of restoration. From the soil to your hand, SweetB continues the story of nature\'s gift — steady, clean, and enduring.',
      tagline: 'Vitality Reborn.',
      benefitsButton: 'Discover Benefits',
      contactButton: 'Get in Touch',
    },
  },
  ms: {
    back: '← Kembali ke Laman Utama',
    title: 'Legenda Candy B',
    origin: {
      title: 'Asal Usul',
      p1: 'Tinggi di pergunungan Peru, di mana awan menggantung rendah dan angin berbau herba liar, tradisi yang tenang bermula. Penyembuh tempatan mengkaji tumbuhan yang tumbuh di ketinggian yang jarang itu, mempelajari akar mana yang memulihkan kekuatan, daun mana yang menenangkan fikiran, dan kulit mana yang menyalakan kembali api badan.',
      p2: 'Dari tangan mereka muncul campuran yang kemudiannya dikenali sebagai <span class="highlight">Formula B</span>.',
    },
    nature: {
      title: 'Kebijaksanaan Alam',
      p1: 'Formula itu dilahirkan dari alam semula jadi. Akar seperti ginseng menawarkan tenaga yang berterusan, sementara tonik lembut mengimbangkan hati dan semangat. Setiap komponen dikumpul dengan tangan dan disediakan dengan teliti, menggunakan kaedah yang memelihara potensi semula jadi herba.',
      p2: 'Hasilnya adalah sesuatu yang kuat namun tenang, sumber vitaliti yang terasa sangat manusiawi.',
    },
    heritage: {
      title: 'Warisan Lima Puluh Tahun',
      p1: 'Selama lebih dari lima puluh tahun, rahsia ini dijaga dalam keluarga Peru yang kecil. Ia diperhalus secara perlahan, dilindungi sebagai kraf dan panggilan.',
      p2: 'Bagi mereka, ia tidak pernah hanya sekadar makanan tambahan, tetapi cara untuk menghormati keseimbangan antara kekuatan manusia dan irama alam.',
    },
    modern: {
      title: 'Evolusi Moden',
      p1: 'Apabila sains akhirnya bertemu dengan warisan ini, formula itu menemui ekspresi baru. Kebijaksanaan ahli herba itu mengilhami <span class="highlight">SweetB</span>, gula-gula diskret yang dibentuk untuk kehidupan moden tetapi berakar pada pengetahuan kuno.',
      p2: 'Setiap kepingan membawa janji pembaharuan yang sama, dibuat dari herba semula jadi dan ramuan tulen yang menyokong tenaga, stamina, dan fokus tanpa paksaan.',
    },
    final: {
      title: 'Dari Andes Kepada Anda',
      text: 'Apa yang bermula sebagai bisikan di Andes kini hidup sebagai tindakan pemulihan yang tenang. Dari tanah ke tangan anda, SweetB meneruskan cerita hadiah alam — stabil, bersih, dan berkekalan.',
      tagline: 'Vitaliti Dilahirkan Semula.',
      benefitsButton: 'Temui Faedah',
      contactButton: 'Hubungi Kami',
    },
  },
  'zh-CN': {
    back: '← 返回首页',
    title: 'Candy B 的传说',
    origin: {
      title: '起源',
      p1: '在秘鲁的高山上，云层低垂，风中有野草的味道，一个安静的传统开始了。当地的治疗师研究那些在罕见海拔生长的植物，学习哪些根能恢复力量，哪些叶子能舒缓心灵，哪些树皮能重新点燃身体的火焰。',
      p2: '从他们的手中诞生了一种混合物，后来被称为 <span class="highlight">Formula B</span>。',
    },
    nature: {
      title: '自然的智慧',
      p1: '这个配方诞生于自然本身。类似人参的根提供持续的能量，而温和的补品平衡心灵和精神。每个成分都是手工采集并精心准备，使用保留草药自然效力的方法。',
      p2: '结果是一种强大而平静的东西，一种感觉非常人性化的活力源泉。',
    },
    heritage: {
      title: '五十年的传承',
      p1: '五十多年来，这个秘密在一个秘鲁小家庭中受到保护。它被缓慢地完善，既作为工艺又作为使命而受到保护。',
      p2: '对他们来说，它从来不仅仅是一种补充剂，而是一种尊重人类力量与自然节奏之间平衡的方式。',
    },
    modern: {
      title: '现代演变',
      p1: '当科学最终遇到这个传承时，配方找到了新的表达。那些草药师的智慧启发了 <span class="highlight">SweetB</span>，一种为现代生活而塑造但植根于古老知识的低调糖果。',
      p2: '每一片都承载着同样的更新承诺，由天然草药和纯成分制成，支持能量、耐力和专注，无需强制。',
    },
    final: {
      title: '从安第斯山脉到您',
      text: '在安第斯山脉开始的低语现在作为安静的恢复行为而存在。从土壤到您的手，SweetB 继续讲述自然的礼物——稳定、清洁和持久。',
      tagline: '活力重生。',
      benefitsButton: '发现益处',
      contactButton: '联系我们',
    },
  },
}

async function main() {
  console.log('📖 Seeding about page translations...')

  for (const [lang, content] of Object.entries(aboutContent)) {
    // Basic page content
    await prisma.content.upsert({
      where: { key_language: { key: 'about.back', language: lang as any } },
      update: { value: content.back, type: 'TEXT', page: 'about' },
      create: { key: 'about.back', language: lang as any, value: content.back, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.title', language: lang as any } },
      update: { value: content.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.title', language: lang as any, value: content.title, type: 'TEXT', page: 'about' },
    })

    // Origin section
    await prisma.content.upsert({
      where: { key_language: { key: 'about.origin.title', language: lang as any } },
      update: { value: content.origin.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.origin.title', language: lang as any, value: content.origin.title, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.origin.p1', language: lang as any } },
      update: { value: content.origin.p1, type: 'TEXT', page: 'about' },
      create: { key: 'about.origin.p1', language: lang as any, value: content.origin.p1, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.origin.p2', language: lang as any } },
      update: { value: content.origin.p2, type: 'TEXT', page: 'about' },
      create: { key: 'about.origin.p2', language: lang as any, value: content.origin.p2, type: 'TEXT', page: 'about' },
    })

    // Nature section
    await prisma.content.upsert({
      where: { key_language: { key: 'about.nature.title', language: lang as any } },
      update: { value: content.nature.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.nature.title', language: lang as any, value: content.nature.title, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.nature.p1', language: lang as any } },
      update: { value: content.nature.p1, type: 'TEXT', page: 'about' },
      create: { key: 'about.nature.p1', language: lang as any, value: content.nature.p1, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.nature.p2', language: lang as any } },
      update: { value: content.nature.p2, type: 'TEXT', page: 'about' },
      create: { key: 'about.nature.p2', language: lang as any, value: content.nature.p2, type: 'TEXT', page: 'about' },
    })

    // Heritage section
    await prisma.content.upsert({
      where: { key_language: { key: 'about.heritage.title', language: lang as any } },
      update: { value: content.heritage.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.heritage.title', language: lang as any, value: content.heritage.title, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.heritage.p1', language: lang as any } },
      update: { value: content.heritage.p1, type: 'TEXT', page: 'about' },
      create: { key: 'about.heritage.p1', language: lang as any, value: content.heritage.p1, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.heritage.p2', language: lang as any } },
      update: { value: content.heritage.p2, type: 'TEXT', page: 'about' },
      create: { key: 'about.heritage.p2', language: lang as any, value: content.heritage.p2, type: 'TEXT', page: 'about' },
    })

    // Modern section
    await prisma.content.upsert({
      where: { key_language: { key: 'about.modern.title', language: lang as any } },
      update: { value: content.modern.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.modern.title', language: lang as any, value: content.modern.title, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.modern.p1', language: lang as any } },
      update: { value: content.modern.p1, type: 'TEXT', page: 'about' },
      create: { key: 'about.modern.p1', language: lang as any, value: content.modern.p1, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.modern.p2', language: lang as any } },
      update: { value: content.modern.p2, type: 'TEXT', page: 'about' },
      create: { key: 'about.modern.p2', language: lang as any, value: content.modern.p2, type: 'TEXT', page: 'about' },
    })

    // Final section
    await prisma.content.upsert({
      where: { key_language: { key: 'about.final.title', language: lang as any } },
      update: { value: content.final.title, type: 'TEXT', page: 'about' },
      create: { key: 'about.final.title', language: lang as any, value: content.final.title, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.final.text', language: lang as any } },
      update: { value: content.final.text, type: 'TEXT', page: 'about' },
      create: { key: 'about.final.text', language: lang as any, value: content.final.text, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.final.tagline', language: lang as any } },
      update: { value: content.final.tagline, type: 'TEXT', page: 'about' },
      create: { key: 'about.final.tagline', language: lang as any, value: content.final.tagline, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.final.benefitsButton', language: lang as any } },
      update: { value: content.final.benefitsButton, type: 'TEXT', page: 'about' },
      create: { key: 'about.final.benefitsButton', language: lang as any, value: content.final.benefitsButton, type: 'TEXT', page: 'about' },
    })
    await prisma.content.upsert({
      where: { key_language: { key: 'about.final.contactButton', language: lang as any } },
      update: { value: content.final.contactButton, type: 'TEXT', page: 'about' },
      create: { key: 'about.final.contactButton', language: lang as any, value: content.final.contactButton, type: 'TEXT', page: 'about' },
    })
  }

  console.log('✨ About page translations seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

