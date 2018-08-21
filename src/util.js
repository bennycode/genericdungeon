export const rand = (min, max) => Math.floor(max !== undefined ? Math.random() * (max - min) + min : Math.random() * min);
export const randFromArray = array => array[rand(array.length)];
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));