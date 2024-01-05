"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActionsProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
}

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId } = useAuth();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) => toast.success(`Following ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"));
        });
    }

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) => toast.success(`Unfollowed ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"));
        });
    }

    const toggleFollow = () => {
        if (!userId) {
            return router.push("/sign-in");
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto border"
        >
            <Heart className={cn(
                "h-4 w-4 mr-2",
                isFollowing
                    ? "fill-white"
                    : "fill-none"
            )} />
            {isFollowing
                ? "Unfollow"
                : "Follow"
            }
        </Button>
    );
}

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24" />
    );
}