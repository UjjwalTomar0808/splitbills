import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Ujjwal",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "RISHABH",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "AAA",
    image: "https://i.pravatar.cc/48",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriends((current) =>
      current.some((f) => f.id === friend.id)
        ? current.filter((f) => f.id !== friend.id)
        : [...current, friend]
    );
  }

  function handleSplitBill(title, totalAmount) {
    if (selectedFriends.length === 0 || totalAmount <= 0) return;

    const splitAmount = totalAmount / (selectedFriends.length + 1);

    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriends.some((f) => f.id === friend.id)
          ? { ...friend, balance: friend.balance + splitAmount }
          : friend
      )
    );

    setSelectedFriends([]);
  }

  function handleClearBalance() {
    setFriends((friends) =>
      friends.map((friend) => ({ ...friend, balance: 0 }))
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriends={selectedFriends}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
        
        <Button onClick={handleClearBalance}>Clear Balance</Button>
      </div>

      {selectedFriends.length > 0 && (
        <FormSplitBill
          selectedFriends={selectedFriends}
          onSplitBill={handleSplitBill}
          key={selectedFriends.map(f => f.id).join("-")}
        />
      )}
    </div>
  );

}

function FriendsList({ friends, onSelection, selectedFriends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriends={selectedFriends}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriends }) {
  const isSelected = selectedFriends.some((f) => f.id === friend.id);

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}Rs
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}Rs
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Deselect" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || totalAmount <= 0) return;
    onSplitBill(title, Number(totalAmount));
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.map(f => f.name).join(", ")}</h2>

      <label>📜 Bill title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>💰 Total bill amount</label>
      <input
        type="number"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        min="0"
      />

      <Button>Split bill</Button>
    </form>
  );
}
