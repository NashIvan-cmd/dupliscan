import { OpenAI } from "openai";
import { loadImage } from "./perceptual";

export async function openAI(image1, image2){
    const client = new OpenAI();

    const loc_image1 = loadImage(image1)
    const loc_image2 = loadImage(image2)
    const response = await client.responses.create({
        model: "gpt-5",
        input : [
            { content: [
                {
                    image1: loc_image1,
                    image2: loc_image2
                }, 
                {
                    text: "Compare the two images and describe their similarities. Give a percentage score of how similar the images are."
                }
            ]}
        ]
    })

    if (response.error) {
        throw new Error(`OpenAI API error: ${response.error.message}`);
    }

    return response;
}