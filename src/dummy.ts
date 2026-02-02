import type { Config } from './types';

export const dummyConfig: Config = {
    theme: "default",
    timer: 5,
    gameBoard: [
        {
            category: "Category 1",
            items: [
                { title: "Item 1", imgFile: "placeholder.png", hint: "This is a hint" },
                { title: "Item 2", imgFile: "placeholder.png" },
            ],
        },
        {
            category: "Category 2",
            items: [
                { title: "Pic 1", imgFile: "placeholder.png", hint: "This is a hint" },
                { title: "Pic 2", imgFile: "placeholder.png" },
                { title: "Pic 3", imgFile: "placeholder.png" },
            ],
        },
        {
            category: "Category 3",
            items: [
                { title: "Item 1", imgFile: "placeholder.png", hint: "This is a hint" },
                { title: "Item 2", imgFile: "placeholder.png" },
            ],
        },
    ]
};