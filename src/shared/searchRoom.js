export default function searchRoom(search){
    return function(x){
        var name = x.name;
        return name.toLowerCase().includes(search.toLowerCase()) || !search;
    }
}