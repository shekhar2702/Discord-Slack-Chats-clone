import { useState, useEffect } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user }) => {
  return (
    <div className="user-item__wrapper">
      <div className="item-name__wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
      </div>
    </div>
  );
};

const UserList = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    if (client) {
      getUsers();
    }
  }, []);

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users .....</div>
      ) : (
        users?.map((user, i) => {
          <UserItem index={i} key={user.id} user={user} />;
        })
      )}
    </ListContainer>
  );
};

export default UserList;
