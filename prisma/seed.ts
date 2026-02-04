import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@devigation.com' },
    update: {},
    create: {
      email: 'test@devigation.com',
      username: 'testuser',
      displayName: 'Test User',
      bio: '개발자를 위한 로드맵 플랫폼 테스트 유저입니다.',
      provider: 'github',
      providerId: '12345678',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample roadmap
  const roadmap = await prisma.roadmap.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: user.id,
      title: 'Backend Developer Roadmap 2024',
      description: '백엔드 개발자가 되기 위한 학습 로드맵입니다.',
      category: 'backend',
      isPublic: true,
      nodes: JSON.stringify([
        { id: '1', type: 'default', position: { x: 250, y: 0 }, data: { label: 'Internet Basics' } },
        { id: '2', type: 'default', position: { x: 250, y: 100 }, data: { label: 'JavaScript/TypeScript' } },
        { id: '3', type: 'default', position: { x: 250, y: 200 }, data: { label: 'Node.js' } },
        { id: '4', type: 'default', position: { x: 250, y: 300 }, data: { label: 'Databases' } },
      ]),
      edges: JSON.stringify([
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
      ]),
    },
  });

  console.log(`✅ Created roadmap: ${roadmap.title}`);

  // Create sample post
  const post = await prisma.post.upsert({
    where: { slug: 'getting-started-with-nestjs' },
    update: {},
    create: {
      userId: user.id,
      roadmapId: roadmap.id,
      nodeId: '3',
      title: 'NestJS 시작하기',
      slug: 'getting-started-with-nestjs',
      content: '# NestJS 시작하기\n\nNestJS는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다.\n\n## 설치\n\n```bash\nnpm install -g @nestjs/cli\nnest new project-name\n```',
      excerpt: 'NestJS는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다.',
      tags: ['NestJS', 'Node.js', 'TypeScript', 'Backend'],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log(`✅ Created post: ${post.title}`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
