"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Table as TableIcon, Eraser } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import { useSong } from "@/lib/hook/useSong";
import { useQuery } from "@tanstack/react-query";
import songApi from "@/api/songs";
import Loading from "./Loading";
import { Error404 } from "@/pages/NFT/error/Error404";
import { ISongCard } from "@/lib/types";

export default function DialogTrashSongs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { restoreSong } = useSong();
  const { data, isLoading, error } = useQuery({
    queryKey: ["trash song"],
    queryFn: async () => {
      return await songApi.getSongsTrash();
    },
    gcTime: 2,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error404 />;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Nút bấm kích hoạt */}
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <TableIcon className="w-4 h-4" /> {/* Sử dụng TableIcon */}
          Bài hát đã xóa ({data.length})
        </Button>
      </DialogTrigger>

      {/* Nội dung Dialog */}
      <DialogContent className="max-w-4xl p-2 bg-slate-700 border-gray-800">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {data.map((song: ISongCard) => (
                  <TableRow
                    key={song.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-right">
                      <div className="flex items-center justify-between gap-2">
                        <div className=" flex text-white items-center gap-4 w-1/3">
                          <img
                            src={`${song.coverImage}`}
                            alt=""
                            className="w-14 h-14"
                          />
                          <p className="text-center">{song.title}</p>
                        </div>

                        <div>
                          <Button
                            size="sm"
                            onClick={() => restoreSong.mutate(song.id)}
                            disabled={
                              restoreSong.isPending &&
                              restoreSong.variables === song.id
                            }
                            className="bg-red-900/20 hover:bg-red-900/40 text-green-400 h-8 px-3"
                          >
                            <Eraser className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
