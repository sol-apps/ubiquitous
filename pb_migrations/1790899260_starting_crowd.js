/// <reference path="../pb_data/types.d.ts" />
// A starting crowd, so the very first game has something to match: a few hundred guesses
// at what most people would say. Real answers pile on top and soon outweigh them.
migrate((app) => {
  const crowd = {
    "fruit": { "apple": 14, "banana": 11, "orange": 8, "strawberry": 6, "grape": 4, "mango": 4, "pear": 3, "pineapple": 3, "cherry": 2, "watermelon": 2, "kiwi": 2, "peach": 2 },
    "colour": { "blue": 15, "red": 12, "green": 10, "purple": 6, "yellow": 5, "black": 4, "orange": 3, "pink": 3, "white": 2, "grey": 2 },
    "kitchen": { "fridge": 11, "kettle": 9, "sink": 8, "oven": 7, "knife": 5, "toaster": 4, "microwave": 4, "spoon": 3, "cupboard": 2, "plate": 2 },
    "pocket": { "phone": 18, "keys": 12, "wallet": 7, "nothing": 5, "tissue": 3, "coins": 2, "lip balm": 2, "receipt": 2, "lint": 2, "headphones": 2 },
    "pet-name": { "max": 9, "bella": 8, "luna": 8, "charlie": 6, "buddy": 5, "milo": 5, "coco": 4, "daisy": 3, "rex": 3, "fluffy": 3, "tiger": 2 },
    "sunday": { "sleep": 12, "roast dinner": 8, "relax": 8, "brunch": 6, "walk": 6, "church": 4, "football": 4, "laundry": 3, "read": 3, "nothing": 2 },
    "everyday-word": { "hello": 13, "okay": 12, "yes": 10, "thanks": 8, "sorry": 6, "no": 5, "like": 4, "please": 3, "hi": 3, "love": 2 },
    "everywhere": { "plastic": 10, "phones": 9, "dust": 8, "air": 7, "people": 6, "adverts": 5, "pigeons": 4, "germs": 3, "wifi": 3, "sand": 2, "coffee": 2 },
    "breakfast": { "toast": 14, "cereal": 12, "eggs": 10, "porridge": 7, "bacon": 5, "pancakes": 4, "croissant": 3, "yoghurt": 3, "fruit": 2, "granola": 2 },
    "sport": { "football": 18, "tennis": 10, "basketball": 8, "cricket": 6, "rugby": 5, "golf": 4, "swimming": 3, "running": 2, "boxing": 2, "snooker": 1 },
    "zoo": { "lion": 15, "elephant": 12, "giraffe": 11, "monkey": 8, "penguin": 6, "tiger": 6, "zebra": 4, "gorilla": 3, "bear": 2, "flamingo": 2 },
    "holiday": { "passport": 13, "suitcase": 9, "sunscreen": 9, "phone": 6, "book": 6, "sunglasses": 5, "swimsuit": 4, "camera": 3, "charger": 3, "toothbrush": 2 },
    "instrument": { "guitar": 17, "piano": 15, "drums": 10, "violin": 9, "trumpet": 4, "flute": 4, "saxophone": 3, "cello": 2, "bass": 2, "ukulele": 2 },
    "vegetable": { "carrot": 16, "broccoli": 11, "potato": 9, "peas": 6, "cucumber": 4, "onion": 4, "lettuce": 3, "tomato": 3, "spinach": 2, "sweetcorn": 2 },
    "sky": { "sun": 14, "clouds": 13, "birds": 9, "moon": 7, "plane": 7, "stars": 4, "rainbow": 2, "kite": 2, "helicopter": 1 },
    "late": { "traffic": 18, "overslept": 9, "train": 8, "alarm": 5, "bus": 5, "weather": 3, "kids": 3, "queue": 2, "lost keys": 2 },
    "board-game": { "monopoly": 22, "chess": 14, "scrabble": 9, "cluedo": 6, "risk": 4, "checkers": 3, "catan": 3, "snakes and ladders": 3, "ludo": 2 },
    "charge": { "phone": 26, "laptop": 9, "battery": 5, "car": 4, "watch": 4, "headphones": 4, "toothbrush": 2, "tablet": 2 },
    "classroom": { "desk": 12, "chair": 9, "whiteboard": 9, "pen": 6, "book": 6, "teacher": 6, "pencil": 4, "clock": 3, "board": 3 },
    "topping": { "pepperoni": 18, "cheese": 9, "mushroom": 8, "ham": 6, "pineapple": 6, "olives": 4, "onion": 3, "peppers": 3, "sausage": 2, "chicken": 2 },
    "round": { "ball": 20, "wheel": 8, "sun": 5, "moon": 5, "plate": 5, "coin": 4, "clock": 3, "orange": 3, "pizza": 3, "globe": 2 },
    "drink": { "water": 16, "tea": 13, "coffee": 12, "beer": 6, "wine": 5, "juice": 4, "milk": 4, "cola": 3, "lemonade": 2, "smoothie": 1 },
    "big": { "huge": 18, "large": 15, "giant": 9, "massive": 8, "enormous": 6, "gigantic": 4, "vast": 2, "immense": 2, "colossal": 2 },
    "superpower": { "flying": 16, "invisibility": 13, "teleportation": 9, "telepathy": 5, "super strength": 5, "super speed": 4, "time travel": 4, "mind reading": 2, "healing": 2 },
  };
  const answers = app.findCollectionByNameOrId("answers");
  for (const prompt in crowd) {
    for (const answer in crowd[prompt]) {
      for (let i = 0; i < crowd[prompt][answer]; i++) {
        const record = new Record(answers);
        record.set("prompt", prompt);
        record.set("answer", answer);
        app.save(record);
      }
    }
  }
}, (app) => {
  // Nothing to undo on its own: the collections' own down migration drops them.
});
