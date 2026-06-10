const configs = import.meta.glob("../../nonexistent.json", { eager: true });
console.log(configs);
