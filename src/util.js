export const rand = (min, max) => Math.floor(max !== undefined ? Math.random() * (max - min) + min : Math.random() * min);
export const randFromArray = array => array[rand(array.length)];