import { Restaurant, Friend } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: '大成海鲜拉面 (复兴SOHO店)',
    cuisine: '日料粉面',
    desc: '汤底厚重过瘾，一碗大碗拉面让你汗流浃背、打败下午所有瞌睡！',
    rating: 4.8,
    avgPrice: 42,
    distance: 280,
    deliveryTime: 20,
    emoji: '🍜',
    coordinates: { x: -45, y: 35 },
    famousDish: '招牌地狱海鲜拉面',
    famousDishes: [
      '招牌地狱海鲜拉面 (厚切大虾、鲜蛤、秘制火辣高汤) — ￥45',
      '黑蒜油厚切叉烧面 (原熬高汤、厚切秘制猪五花、黑蒜油) — ￥38',
      '日式火山辣子鸡 (鲜嫩鸡腿肉、地狱红椒面、芝麻) — ￥29'
    ],
    memeComment: '辣油非常高纯，适合嗜辣星人，下午瞌睡的终极克星！'
  },
  {
    id: 'rest-2',
    name: '柳姐正宗广西螺蛳粉 (吉安路店)',
    cuisine: '特色粉面',
    desc: '汤底极其芬芳浓烈，炸蛋金黄爆浆，整个弄堂都能闻到它的野味。',
    rating: 4.7,
    avgPrice: 35,
    distance: 420,
    deliveryTime: 25,
    emoji: '🪵',
    coordinates: { x: 60, y: -50 },
    famousDish: '重组炸蛋螺蛳粉',
    famousDishes: [
      '双炸蛋酸笋螺蛳粉 (双份黄金大炸蛋、爽脆酸笋、秘制辣油) — ￥35',
      '香脆臭豆腐拼盘 (现炸外脆内嫩臭豆腐、秘制川辣干碟) — ￥18',
      '招牌大猪脚捞螺蛳粉 (Q弹卤猪蹄、秘制酸辣汤底、广西米粉) — ￥38'
    ],
    memeComment: '配料超级顶，吃完返回工位身上自带迷人芬芳！'
  },
  {
    id: 'rest-3',
    name: '麦米沙拉 Maimi Salads (马当路店)',
    cuisine: '轻食沙拉',
    desc: '控糖减脂党的极致闭环，吃完感觉格外轻盈清透，下午开会不犯困。',
    rating: 4.2,
    avgPrice: 58,
    distance: 120,
    deliveryTime: 15,
    emoji: '🥗',
    coordinates: { x: 15, y: 25 },
    famousDish: '金枪鱼低温牛油果沙拉',
    famousDishes: [
      '金枪鱼低温牛油果沙拉 (深海金枪鱼、新鲜牛油果、黑醋酱汁) — ￥58',
      '香煎嫩烤牛肉温沙拉 (高品质原切牛排、小番茄、烤南瓜) — ￥68',
      '羽衣甘蓝牛油果冷榨汁 (纯冷榨高纤维羽衣甘蓝、新鲜牛油果) — ￥26'
    ],
    memeComment: '食材一咬爆水，下午完全没负罪感，中产实习生最爱。'
  },
  {
    id: 'rest-4',
    name: '湘味阁家常木桶饭 (淡水路店)',
    cuisine: '中式简餐',
    desc: '闪电干饭战神店，出餐只需要30秒，香辣爆炒米饭浸汁狂扒两碗。',
    rating: 4.5,
    avgPrice: 22,
    distance: 350,
    deliveryTime: 18,
    emoji: '🍛',
    coordinates: { x: -80, y: -20 },
    famousDish: '双拼回锅肉木桶饭',
    famousDishes: [
      '双拼回锅肉木桶饭 (鲜五花肉、香辣五常米、爆炒叶青椒) — ￥24',
      '香辣青椒鸡杂木桶饭 (脆爽鸡杂、特制泡椒、老红酱油) — ￥22',
      '青豌豆肉末蒸蛋木桶饭 (手剥嫩青豆、土鸡蛋液、鲜肉末) — ￥20'
    ],
    memeComment: '分量超级夯！猛炒的烟火气，吃完精力瞬间回满。'
  },
  {
    id: 'rest-5',
    name: '粉红汉堡 Charlie\'s (复兴SOHO店)',
    cuisine: '美式西餐',
    desc: '厚牛爆汁、芝士拉丝的美式重磅汉堡顶流，咬一口满满的治愈感。',
    rating: 4.9,
    avgPrice: 68,
    distance: 150,
    deliveryTime: 15,
    emoji: '🍔',
    coordinates: { x: 30, y: 70 },
    famousDish: '厚牛芝士瀑布汉堡',
    famousDishes: [
      '厚牛芝士瀑布汉堡 (双层安格斯牛肉饼、拉汁车达芝士) — ￥68',
      '松露黑金香脆薯条 (宽切马铃薯、现刨黑松露酱、芝士粉) — ￥28',
      '海盐牛油果超浓奶昔 (新鲜牛油果、海盐颗粒、进口香草冰淇淋) — ￥35'
    ],
    memeComment: '汁水狂飙！一口下去芝士和厚牛肉的多巴胺在舌尖引爆。'
  },
  {
    id: 'rest-6',
    name: '川江川式爆炒肥肠鸡 (新天地店)',
    cuisine: '川湘名菜',
    desc: '红油滚烫、鲜艳刺激的肥肠炖土鸡，跟搭子拼一拼实在爽到升天。',
    rating: 4.6,
    avgPrice: 78,
    distance: 850,
    deliveryTime: 35,
    emoji: '🐔',
    coordinates: { x: -75, y: 80 },
    famousDish: '爆炒麻辣肥肠鸡双人锅',
    famousDishes: [
      '爆炒麻辣肥肠鸡双人锅 (优质软糯肥肠、走地土鸡肉、手打苕粉) — ￥78',
      '麻辣无骨鲜鸭掌 (去骨鸭爪、特调川派红麻油、黄瓜丝) — ￥42',
      '黄金爆浆糍粑 (手打手工糯米、浓郁纯黑红糖浆、大豆粉) — ￥18'
    ],
    memeComment: '重味觉突破，大汗淋漓，吃辣爱好者的绝佳据点。'
  },
  {
    id: 'rest-7',
    name: '小蓝瓶咖啡 Blue Bottle (新天地店)',
    cuisine: '咖啡烘焙',
    desc: '极简美学下午茶圣地，醇香现冲咖啡配上有嚼劲的贝果体面又饱腹。',
    rating: 4.4,
    avgPrice: 48,
    distance: 90,
    deliveryTime: 10,
    emoji: '🥯',
    coordinates: { x: -20, y: -15 },
    famousDish: '经典冷萃生椰拿铁套餐',
    famousDishes: [
      '经典冷萃生椰拿铁套餐 (新鲜冷萃原浆、高纯生椰乳、香草糖浆) — ￥48',
      '原麦芝麻肉松贝果 (全麦老酵贝果、海苔芝麻肉松、咸芝士) — ￥22',
      '极简单品手冲咖啡 (现磨浅切耶加雪菲原豆、柑橘花果香) — ￥38'
    ],
    memeComment: '简便精致，提神醒脑效果拔群，下午工作有如神助。'
  },
  {
    id: 'rest-8',
    name: '老弄堂本帮阿婆面馆 (淡水路店)',
    cuisine: '本帮快餐',
    desc: '传统的浓油赤酱红烧肉，赤酱均匀，色泽诱人，肥而不腻。',
    rating: 4.5,
    avgPrice: 38,
    distance: 510,
    deliveryTime: 22,
    emoji: '🥩',
    coordinates: { x: 90, y: 10 },
    famousDish: '秘制浓油本帮红烧肉饭',
    famousDishes: [
      '秘制浓油本帮红烧肉饭 (慢炖五花肉、香软百叶结、卤鹌鹑蛋) — ￥38',
      '金牌招牌响油鳝丝面 (江南原鳝丝、滚烫葱油、手工碱水面) — ￥45',
      '正宗老上海炸猪排 (香酥苏打炸带骨猪排、泰康辣酱油) — ￥18'
    ],
    memeComment: '红烧肉一咬化开，浓油酱汁拌在白米饭上面是绝世美味！'
  },
  {
    id: 'rest-9',
    name: '蔡澜港式点心 (复兴SOHO店)',
    cuisine: '广式点心',
    desc: '米其林团队研发的精致广式点心，优雅、暖和又没有任何油烟感。',
    rating: 4.3,
    avgPrice: 45,
    distance: 620,
    deliveryTime: 24,
    emoji: '🍲',
    coordinates: { x: 50, y: 90 },
    famousDish: '酥皮山楂叉烧包',
    famousDishes: [
      '酥皮山楂叉烧包 (微酸新鲜山楂酱、黄脆脆皮叉烧肉) — ￥33',
      '古法经典干炒牛河 (手切鲜黄牛肉、大厨高火铁镬河粉) — ￥48',
      '大颗原只鲜虾饺 (三只整原只鲜虾仁、清脆手工笋尖) — ￥36'
    ],
    memeComment: '吃完口腔清清爽爽，下午去见老板开会都不失体面。'
  },
  {
    id: 'rest-10',
    name: '萨莉亚意式餐厅 (复兴马当路附近)',
    cuisine: '意式便餐',
    desc: '打工人拼桌性价比之光，用零钱就能点满一桌意料意面，超划算！',
    rating: 4.6,
    avgPrice: 28,
    distance: 720,
    deliveryTime: 28,
    emoji: '🍕',
    coordinates: { x: -90, y: -80 },
    famousDish: '西西里风味蒜香烤蜗牛',
    famousDishes: [
      '西西里风味蒜香烤蜗牛 (大颗鲜蜗牛砸、秘制蒜泥烤牛油) — ￥22',
      '流浆香浓双重芝士披萨 (香浓马苏里拉芝士、黄金香脆饼底) — ￥24',
      '黑椒牛排配黄金薯角 (优质牛外脊排、黑胡椒浓汁、炸松脆薯角) — ￥29'
    ],
    memeComment: '极高性价比，实习生周五拼桌狂欢无压力首选基地！'
  },
  {
    id: 'rest-11',
    name: '火山熔岩和牛烧肉丼 (SOHO复兴店)',
    cuisine: '日式烧肉',
    desc: '日式烧肉界顶流，和牛堆砌得像小山一样高，温泉蛋爆浆溢出。',
    rating: 4.9,
    avgPrice: 98,
    distance: 180,
    deliveryTime: 12,
    emoji: '🔥',
    coordinates: { x: -10, y: 50 },
    famousDish: '爆汁温泉蛋和牛烧肉丼',
    famousDishes: [
      '爆汁温泉蛋和牛烧肉丼 (高品质M5和牛、兰皇无菌温泉蛋、密藏照烧汁) — ￥98',
      '熔岩芝士烤厚切牛排丼 (原麦芝士浓浆、碳烤菲力牛排肉) — ￥88',
      '多汁原味脆皮大鸡块 (现炸带皮鸡腿丁、特制蜂蜜香芥酱) — ￥22'
    ],
    memeComment: '肉质香嫩到流泪！虽然排队要30分钟，但吃第一口就觉得值了。'
  },
  {
    id: 'rest-12',
    name: '潮界手打牛肉丸汤 (新天地店)',
    cuisine: '粤式汤品',
    desc: '正宗鲜牛肉丸爽口爆汁，辅以香芹末和清牛大骨汤，清温和舒展。',
    rating: 4.7,
    avgPrice: 45,
    distance: 480,
    deliveryTime: 20,
    emoji: '🥣',
    coordinates: { x: -40, y: -45 },
    famousDish: '手打潮汕牛筋爆丸清汤',
    famousDishes: [
      '手打潮汕牛筋爆丸清汤 (手工Q弹牛肉丸、清底猪牛骨汤、芹菜碎) — ￥45',
      '老潮汕鲜虾云吞米线 (手包皮鲜虾云吞、温和熬制清汤、爽滑米线) — ￥38',
      '红枣慢熬桃胶冰糖银耳 (优质红砂糖、慢炖小银耳、桃胶) — ￥18'
    ],
    memeComment: '牛肉丸弹到牙齿，喝一碗温热的大骨清汤，下午的胃十分踏实。'
  }
];

export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    name: '小林 (阿林)',
    avatar: '🦊',
    department: '研发部',
    role: 'Intern',
    personality: ['速战速决型', '重口型', '探店型'],
    favoriteRestaurantIds: ['rest-1', 'rest-2', 'rest-11'],
    statusSignal: true
  },
  {
    id: 'friend-2',
    name: '陈不卷 (Shawn)',
    avatar: '🐼',
    department: '用户体验设计',
    role: 'Intern',
    personality: ['边吃边聊型', '探店型', '养生型'],
    favoriteRestaurantIds: ['rest-3', 'rest-7', 'rest-12'],
    statusSignal: true
  },
  {
    id: 'friend-3',
    name: '琪琪 (KiKi)',
    avatar: '🐰',
    department: '市场运营',
    role: 'Full-time',
    personality: ['边吃边聊型', '探店型'],
    favoriteRestaurantIds: ['rest-5', 'rest-11', 'rest-7'],
    statusSignal: false
  },
  {
    id: 'friend-4',
    name: '张架构 (Alan)',
    avatar: '🐨',
    department: '系统架构科',
    role: 'Full-time',
    personality: ['速战速决型', '养生型'],
    favoriteRestaurantIds: ['rest-4', 'rest-10', 'rest-12'],
    statusSignal: true
  },
  {
    id: 'friend-5',
    name: '阿美 (Amy)',
    avatar: '🐯',
    department: '大前端组',
    role: 'Intern',
    personality: ['探店型', '重口型', '边吃边聊型'],
    favoriteRestaurantIds: ['rest-1', 'rest-2', 'rest-6'],
    statusSignal: true
  }
];
