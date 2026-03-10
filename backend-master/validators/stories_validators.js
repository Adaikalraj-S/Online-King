const Joi = require("joi");

const fetch_all_stories_validators = Joi.object({
    // id: Joi.number().integer().allow(null),
    story_id: Joi.number().integer().allow(null)
})

const add_stories_payload = Joi.object({
    customer_id: Joi.number().integer().required(),
    heading: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.any().required(),
})

const add_video_stories_payload = Joi.object({
    customer_id: Joi.number().integer().required(),
    heading: Joi.string().required(),
    description: Joi.string().required(),
    video: Joi.any().required(),
})

const approve_story_validator = Joi.object({
    story_id: Joi.number().integer().required()
});

const reject_story_validator = Joi.object({
    story_id: Joi.number().integer().required(),
    rejected_reason: Joi.string().required(),
});

const delete_story_validator = Joi.object({
    story_id: Joi.number().integer().required()
});

const statusChangeStoryValidator = Joi.object({
    story_id: Joi.number().integer().required()
});

const editStoriesPayload = Joi.object({
    story_id: Joi.number().integer(), 
    customer_id: Joi.number().integer().required(),
    heading: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.any(), 
    video: Joi.any(),
    product_ids: Joi.string().allow(null).allow('')
});



module.exports = {
    fetch_all_stories_validators,
    add_stories_payload,
    add_video_stories_payload,
    approve_story_validator,
    reject_story_validator,
    delete_story_validator,
    statusChangeStoryValidator,
    editStoriesPayload
};