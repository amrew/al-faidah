/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "apiapk.radioislam.or.id",
        port: "",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/radio/url/46.30.188.192/8100",
        destination: "http://46.30.188.192:8100/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8040",
        destination: "http://46.30.188.192:8040/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8030",
        destination: "http://46.30.188.192:8030/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8150",
        destination: "http://185.213.175.99:8150/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8060",
        destination: "http://185.213.175.99:8060/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11180",
        destination: "http://27.0.234.202:11180/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9744",
        destination: "http://27.0.234.202:9744/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8020",
        destination: "http://185.244.30.106:8020/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8200",
        destination: "http://46.30.188.192:8200/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8110",
        destination: "http://185.244.30.106:8110/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11252",
        destination: "http://27.0.234.202:11252/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11114",
        destination: "http://27.0.234.202:11114/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8030",
        destination: "http://185.213.175.99:8030/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9444",
        destination: "http://27.0.234.202:9444/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8030",
        destination: "http://5.255.103.42:8030/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/10140",
        destination: "http://27.0.234.202:10140/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11300",
        destination: "http://27.0.234.202:11300/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8010",
        destination: "http://185.244.30.106:8010/;stream.mp3u",
      },
      {
        source: "/radio/url/128.199.227.213/8026",
        destination: "http://128.199.227.213:8026/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11354",
        destination: "http://27.0.234.202:11354/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8010",
        destination: "http://185.213.175.99:8010/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8130",
        destination: "http://46.30.188.192:8130/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8070",
        destination: "http://5.255.103.42:8070/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11078",
        destination: "http://27.0.234.202:11078/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11546",
        destination: "http://27.0.234.202:11546/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8020",
        destination: "http://5.255.103.42:8020/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9090",
        destination: "http://27.0.234.202:9090/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11600",
        destination: "http://27.0.234.202:11600/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8108",
        destination: "http://27.0.234.202:8108/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/12000",
        destination: "http://27.0.234.202:12000/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8180",
        destination: "http://46.30.188.192:8180/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8110",
        destination: "http://46.30.188.192:8110/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8100",
        destination: "http://185.213.175.99:8100/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8910",
        destination: "http://27.0.234.202:8910/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8070",
        destination: "http://185.213.175.99:8070/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9977",
        destination: "http://27.0.234.202:9977/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11132",
        destination: "http://27.0.234.202:11132/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8010",
        destination: "http://5.255.103.42:8010/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11162",
        destination: "http://27.0.234.202:11162/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11102",
        destination: "http://27.0.234.202:11102/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8110",
        destination: "http://185.213.175.99:8110/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8162",
        destination: "http://27.0.234.202:8162/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8120",
        destination: "http://185.213.175.99:8120/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8120",
        destination: "http://46.30.188.192:8120/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8140",
        destination: "http://46.30.188.192:8140/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11234",
        destination: "http://27.0.234.202:11234/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8020",
        destination: "http://27.0.234.202:8020/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8096",
        destination: "http://27.0.234.202:8096/;stream.mp3u",
      },
      {
        source: "/radio/url/103.139.175.40/8520",
        destination: "http://103.139.175.40:8520/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8192",
        destination: "http://27.0.234.202:8192/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8100",
        destination: "http://185.244.30.106:8100/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8040",
        destination: "http://185.244.30.106:8040/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8344",
        destination: "http://27.0.234.202:8344/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11408",
        destination: "http://27.0.234.202:11408/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8060",
        destination: "http://5.255.103.42:8060/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8100",
        destination: "http://5.255.103.42:8100/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8070",
        destination: "http://46.30.188.192:8070/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11618",
        destination: "http://27.0.234.202:11618/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8120",
        destination: "http://185.244.30.106:8120/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9476",
        destination: "http://27.0.234.202:9476/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8040",
        destination: "http://5.255.103.42:8040/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8998",
        destination: "http://27.0.234.202:8998/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8300",
        destination: "http://185.213.175.99:8300/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11126",
        destination: "http://27.0.234.202:11126/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8050",
        destination: "http://185.244.30.106:8050/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8090",
        destination: "http://27.0.234.202:8090/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11066",
        destination: "http://27.0.234.202:11066/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11042",
        destination: "http://27.0.234.202:11042/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8190",
        destination: "http://46.30.188.192:8190/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11582",
        destination: "http://27.0.234.202:11582/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11186",
        destination: "http://27.0.234.202:11186/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11240",
        destination: "http://27.0.234.202:11240/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/9044",
        destination: "http://27.0.234.202:9044/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8140",
        destination: "http://185.244.30.106:8140/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8090",
        destination: "http://5.255.103.42:8090/;stream.mp3u",
      },
      {
        source: "/radio/url/5.255.103.42/8050",
        destination: "http://5.255.103.42:8050/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8180",
        destination: "http://185.213.175.99:8180/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8333",
        destination: "http://27.0.234.202:8333/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11198",
        destination: "http://27.0.234.202:11198/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8090",
        destination: "http://46.30.188.192:8090/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8160",
        destination: "http://46.30.188.192:8160/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8050",
        destination: "http://46.30.188.192:8050/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8150",
        destination: "http://46.30.188.192:8150/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8030",
        destination: "http://185.244.30.106:8030/;stream.mp3u",
      },
      {
        source: "/radio/url/185.244.30.106/8170",
        destination: "http://185.244.30.106:8170/;stream.mp3u",
      },
      {
        source: "/radio/url/46.30.188.192/8060",
        destination: "http://46.30.188.192:8060/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/8012",
        destination: "http://27.0.234.202:8012/;stream.mp3u",
      },
      {
        source: "/radio/url/27.0.234.202/11018",
        destination: "http://27.0.234.202:11018/;stream.mp3u",
      },
      {
        source: "/radio/url/185.213.175.99/8050",
        destination: "http://185.213.175.99:8050/;stream.mp3u",
      },
    ];
  },
};

module.exports = nextConfig;
