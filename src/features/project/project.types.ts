export interface ProjectRequest {
  project_name: string;
  description: string;
}

export interface ProjectResponse extends ProjectRequest {
  _id: string;
  user_id: string;
  created_at: string;
}

export interface ProjectDetailsResponse extends ProjectResponse {
  total_requests: number;
  requests: ProjectRequestSummary[];
}

export interface ProjectRequestSummary {
  request_id: string;
  category_name: string;
  style_name: string;
  status: "PENDING" | "GENERATING_IMAGES" | "COMPLETED" | "FAILED";
  created_at: string;
  result_thumbnail_url: string[] | null; // Array of URLs or null if not available
}

/** 
{
  "project_id": "69e58518ede1c3cc66d43902",
  "project_name": "Mùa xuân ấm áp",
  "total_requests": 12,
  "requests": [
    {
      "request_id": "6a1431630eb27ac77a6cad96",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "GENERATING_IMAGES",
      "created_at": "2026-05-25T11:24:19.429000",
      "result_thumbnail_url": null
    },
    {
      "request_id": "6a142fc40042cec0a4f0f220",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T11:17:24.433000",
      "result_thumbnail_url": [
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779707973/pbl5/generated_designs/6a142fc40042cec0a4f0f220/uym2wpunqgc4ame632s7.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779707976/pbl5/generated_designs/6a142fc40042cec0a4f0f220/d8fdeukznb0ere8eshvq.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779707977/pbl5/generated_designs/6a142fc40042cec0a4f0f220/rqqg18ses2czqvaegjco.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779707979/pbl5/generated_designs/6a142fc40042cec0a4f0f220/h3fv9fhcdlco4pngqdj2.jpg"
      ]
    },
    {
      "request_id": "6a142e55b35e2001a48cba8a",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "GENERATING_IMAGES",
      "created_at": "2026-05-25T11:11:17.273000",
      "result_thumbnail_url": null
    },
    {
      "request_id": "6a142d709e236b120001e139",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "GENERATING_IMAGES",
      "created_at": "2026-05-25T11:07:28.117000",
      "result_thumbnail_url": null
    },
    {
      "request_id": "6a14203fa02f1ea324243ef8",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T10:11:11.085000",
      "result_thumbnail_url": [
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703960/pbl5/generated_designs/6a14203fa02f1ea324243ef8/jjcbtv6fvs5gzpxg7jrr.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703962/pbl5/generated_designs/6a14203fa02f1ea324243ef8/ec6mrayo2qnugvap7w4n.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703965/pbl5/generated_designs/6a14203fa02f1ea324243ef8/gclpegxuasb3j1jw5fnc.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703967/pbl5/generated_designs/6a14203fa02f1ea324243ef8/thfihjxxpqewoamsjjxp.jpg"
      ]
    },
    {
      "request_id": "6a141ec7a02f1ea324243ef6",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T10:04:55.156000",
      "result_thumbnail_url": [
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703592/pbl5/generated_designs/6a141ec7a02f1ea324243ef6/qwck2bc6o2ij7ahncs8z.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703594/pbl5/generated_designs/6a141ec7a02f1ea324243ef6/kk02emlvwu2jdy9f5w35.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703596/pbl5/generated_designs/6a141ec7a02f1ea324243ef6/zaqqz8rhe9bobguf1fzl.jpg",
        "https://res.cloudinary.com/dhwwlropu/image/upload/v1779703597/pbl5/generated_designs/6a141ec7a02f1ea324243ef6/hj09bfobjargv4jyck3l.jpg"
      ]
    },
    {
      "request_id": "6a141b9c719f9b840ef4e22e",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T09:51:24.339000",
      "result_thumbnail_url": [
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_d1a0e668.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_4266068f.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_57fb997c.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_b804eb78.png"
      ]
    },
    {
      "request_id": "6a140f4f50118c628bdee21c",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T08:58:55.720000",
      "result_thumbnail_url": [
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_a79098ac.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_a047a53c.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_7395fde5.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_0462e7a8.png"
      ]
    },
    {
      "request_id": "6a1409a94e66723170ba9f99",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-25T08:34:49.293000",
      "result_thumbnail_url": [
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_df4b0b9b.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_25c5d34f.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_b530d8c5.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_e3543a97.png"
      ]
    },
    {
      "request_id": "6a0600a9438b0a0fb71f2a9f",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-14T17:04:41.269000",
      "result_thumbnail_url": [
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_55c706df.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_f82b317b.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_30309b22.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_dec698c0.png"
      ]
    },
    {
      "request_id": "6a05fcfc438b0a0fb71f2a9d",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-14T16:49:00.104000",
      "result_thumbnail_url": [
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_15682cb6.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_650ed6ab.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_d268ba02.png",
        "https://agreeably-saxophone-showpiece.ngrok-free.dev/outputs/design_c66a9329.png"
      ]
    },
    {
      "request_id": "6a05f949438b0a0fb71f2a9b",
      "category_name": "Vest Nam",
      "style_name": "N/A",
      "status": "COMPLETED",
      "created_at": "2026-05-14T16:33:13.839000",
      "result_thumbnail_url": null
    }
  ]
}
*/
