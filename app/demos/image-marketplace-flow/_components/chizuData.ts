export type WorkItem = {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  width: number;
  height: number;
  tags: string[];
  status: "Buy now" | "Auction" | "Offer";
};

export const works: WorkItem[] = [
  {
    id: "work-01",
    title: "Archive Bloom",
    artist: "Min Park",
    image: "/images/chizu/main1.jpg",
    price: 280_000,
    width: 1000,
    height: 703,
    tags: ["illustration", "character"],
    status: "Buy now",
  },
  {
    id: "work-02",
    title: "Blue Signal",
    artist: "Haru Studio",
    image: "/images/chizu/main2.jpg",
    price: 160_000,
    width: 778,
    height: 1100,
    tags: ["anime", "blue"],
    status: "Auction",
  },
  {
    id: "work-03",
    title: "Soft Protocol",
    artist: "Noah Kim",
    image: "/images/chizu/main3.jpg",
    price: 420_000,
    width: 700,
    height: 811,
    tags: ["portrait", "license"],
    status: "Offer",
  },
  {
    id: "work-04",
    title: "Creator Room",
    artist: "Yuna Lee",
    image: "/images/chizu/main4.jpg",
    price: 310_000,
    width: 1000,
    height: 707,
    tags: ["3d", "interior"],
    status: "Buy now",
  },
  {
    id: "work-05",
    title: "Layered Dream",
    artist: "Studio Oji",
    image: "/images/chizu/main5.jpg",
    price: 190_000,
    width: 782,
    height: 1100,
    tags: ["concept", "dream"],
    status: "Auction",
  },
  {
    id: "work-06",
    title: "Neon Field",
    artist: "Kira",
    image: "/images/chizu/main6.jpg",
    price: 350_000,
    width: 1000,
    height: 707,
    tags: ["neon", "landscape"],
    status: "Buy now",
  },
  {
    id: "work-07",
    title: "Silent Light",
    artist: "Jun Seo",
    image: "/images/chizu/main7.jpg",
    price: 220_000,
    width: 1000,
    height: 683,
    tags: ["archive", "quiet"],
    status: "Offer",
  },
  {
    id: "work-08",
    title: "Pixel Memory",
    artist: "Mori",
    image: "/images/chizu/main8.png",
    price: 130_000,
    width: 2963,
    height: 1667,
    tags: ["pixel", "memory"],
    status: "Buy now",
  },
  {
    id: "work-09",
    title: "Open Canvas",
    artist: "Sora",
    image: "/images/chizu/main9.png",
    price: 480_000,
    width: 2963,
    height: 1667,
    tags: ["canvas", "exclusive"],
    status: "Auction",
  },
];
