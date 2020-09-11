export default function searchRoom(search){
    return function(x){
        var room = x.data.name + ' ' + x.id;
        return room.toLowerCase().includes(search.toLowerCase()) || !search;
    }
}