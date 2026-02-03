import Image from "next/image";
import Link from "next/link";
import type { User, Video } from "@/lib/types";

// Types



// Props expected from server page
export default function  PublicProfilePage({
  user,
  videos,
}: {
  user: User;
  videos: Video[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-5">
        <img
          src={user.image ?? "/avatar-fallback.png"}
          alt={user.name}
          width={64}
          height={64}
          className="rounded-full"
          referrerPolicy="no-referrer"
        />

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.name}
          </h1>
          {user.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search videos"
          className="w-full sm:w-80 px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <select className="px-3 py-2 rounded-md border text-sm">
          <option>Most recent</option>
          <option>Oldest first</option>
          <option>Most viewed</option>
          <option>Least viewed</option>
        </select>
      </div>

      {/* VIDEO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            key={video.videoId}
            href={`/videos/${video.videoId}`}
            className="group rounded-xl border bg-white overflow-hidden hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                width={400}
                height={225}
                className="w-full h-48 object-cover"
              />

              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            {/* Meta */}
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {video.title}
              </h3>

              {/* <p className="text-xs text-gray-500">
                {video.views} views · {video.createdAt}
              </p> */}
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {videos.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          This user hasn’t uploaded any videos yet.
        </div>
      )}
    </div>
  );
}
