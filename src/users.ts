interface User {
    id: string;
    username: string;
    room: string;
}

const users: User[] = []


export function addUser(user: User) {
    user.username = user.username.trim().toLowerCase();
    user.room = user.room.trim().toLowerCase();

    if (!user.username || !user.room) return { error: 'Username and room are required!' };

    const existingUser = users.find((u) => u.room === user.room && u.username === user.username);

    if (existingUser) return { error: 'Username is in use!' };

    users.push(user);
    return { user };
}

export function removeUser(id: string) {
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) return users.splice(index, 1)[0];
}

export function getUser(id: string) {
    return users.find((u) => u.id === id);
}

export function getUsersInRoom(room: string) {
    return users.filter((u) => u.room === room);
}


