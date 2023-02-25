export const abbreviate = (name) => {
    let parts = name.split(" ");

    if (parts.length < 2) {
        return name.substring(0, 2).toUpperCase();
    } else {
        return name[0].toUpperCase() + parts[parts.length-1][0].toUpperCase();
    }
}
