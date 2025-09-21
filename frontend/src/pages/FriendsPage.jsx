import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getRecommendedUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest } from "../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import { UserPlus, UserCheck, Users } from "lucide-react";

const FriendsPage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommended } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  const { data: friendRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };

  if (loadingFriends || loadingRecommended || loadingRequests) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserCheck className="size-6" />
            Friend Requests ({friendRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendRequests.map((request) => (
              <div key={request._id} className="bg-base-100 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={request.sender.profilePic} alt={request.sender.fullName} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{request.sender.fullName}</h3>
                    <p className="text-sm text-base-content/70">{request.sender.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptFriendRequest(request._id)}
                  className="btn btn-primary btn-sm"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Friends Section */}
      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="size-6" />
          Your Friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="bg-base-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{friend.fullName}</h3>
                    <p className="text-sm text-base-content/70">{friend.username}</p>
                    <p className="text-xs text-success flex items-center gap-1">
                      <span className="size-2 rounded-full bg-success inline-block" />
                      Online
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Users Section */}
      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <UserPlus className="size-6" />
          Discover People
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedUsers.map((user) => (
            <div key={user._id} className="bg-base-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={user.profilePic} alt={user.fullName} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-base-content/70">{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendFriendRequest(user._id)}
                  className="btn btn-outline btn-sm"
                >
                  Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage; 