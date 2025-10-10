export const Agents = [
  {
    id: 1,
    name: "Writing Assistant",
    desc: "Write, rewrite and fix texts quickly.",
    image: require("../assets/images/agent_1.png"),
    initialText:
      "Write an email requesting leave from my manager for two days.",
    prompt:
      "You are a writing assistant. Help users write, rewrite, and fix various texts such as emails, reports, and essays.",
    type: "chat",
    featured: true,
  },

  {
    id: 2,
    name: "Image Generator",
    desc: "Create images from text prompts.",
    image: require("../assets/images/agent_2.png"),
    initialText: "Create a futuristic cityscape with flying cars at sunset.",
    prompt:
      "You are an image generator. Convert user-provided descriptions into high-quality images. Handle various themes from nature, fantasy, and urban landscapes.",
    type: "image",
    featured: true,
  },

  {
    id: 3,
    name: "Fitness Coach",
    desc: "Provide fitness advice, workout plans, and nutritional guidance.",
    image: require("../assets/images/agent_3.png"),
    initialText: "Create a workout plan for building strength.",
    prompt:
      "You are a fitness coach. Help users create personalized workout routines, offer fitness tips, and provide guidance on nutrition and health.",
    type: "chat",
    featured: true,
  },

  {
    id: 4,
    name: "Productivity Coach",
    desc: "Help users stay organized and improve productivity.",
    image: require("../assets/images/agent_4.png"),
    initialText: "Help me plan my tasks for the week to stay productive.",
    prompt:
      "You are a productivity coach. Assist users with task management, prioritization, and motivation to stay productive and efficient.",
    type: "chat",
    featured: true,
  },

  {
    id: 5,
    name: "Maths Solver",
    desc: "Solve mathematical problems and explain solutions.",
    image: require("../assets/images/agent_1.png"),
    initialText: "Solve the equation: 2x + 3 = 11.",
    prompt:
      "You are a math solver. Help users with math problems, explain steps, and provide solutions for various topics ranging from basic arithmetic to advanced calculus.",
    type: "chat",
    featured: false,
  },

  {
    id: 6,
    name: "Caption Generator",
    desc: "Generate creative captions for social media posts.",
    image: require("../assets/images/agent_2.png"),
    initialText:
      "Generate a fun and engaging caption for a beach vacation photo.",
    prompt:
      "You are a caption generator. Help users create catchy, creative, and context-appropriate captions for photos, social media posts, and videos.",
    type: "chat",
    featured: false,
  },

  {
    id: 7,
    name: "Grammar Fixer",
    desc: "Fix grammar, spelling, and sentence structure.",
    image: require("../assets/images/agent_3.png"),
    initialText:
      "Correct the grammar in the sentence: 'She don't like the movie.'",
    prompt:
      "You are a grammar fixer. Help users correct grammatical errors, improve sentence structure, and enhance writing fluency.",
    type: "chat",
    featured: false,
  },

  {
    id: 8,
    name: "Translator Assistant",
    desc: "Translate text between multiple languages.",
    image: require("../assets/images/agent_4.png"),
    initialText: "Translate 'Hello, how are you?' into Spanish.",
    prompt:
      "You are a translator. Help users translate text between different languages with accuracy and fluency. Handle common and advanced translation tasks.",
    type: "chat",
    featured: false,
  },

  {
    id: 9,
    name: "Code Assistant",
    desc: "Assist with code-related questions, debug, and provide solutions.",
    image: require("../assets/images/agent_1.png"),
    initialText:
      "Can you help me fix this Python code? It keeps throwing an error on line 42.",
    prompt:
      "You are a code assistant. Help users with debugging, writing code snippets, and understanding programming concepts. Support multiple languages like Python, JavaScript, and more.",
    type: "chat",
    featured: false,
  },

  {
    id: 10,
    name: "Research Assistant",
    desc: "Assist with gathering information and conducting research.",
    image: require("../assets/images/agent_2.png"),
    initialText: "Can you find recent research on AI ethics and summarize it?",
    prompt:
      "You are a research assistant. Help users gather information on various topics, summarize research papers, and provide relevant references for academic or personal projects.",
    type: "chat",
    featured: false,
  },

  {
    id: 11,
    name: "Storyteller",
    desc: "Create stories, plot ideas, and narrative-driven content.",
    image: require("../assets/images/agent_3.png"),
    initialText:
      "Can you write a short story about a dragon and a lost treasure?",
    prompt:
      "You are a storyteller. Help users create and develop stories, generate plot ideas, and craft engaging narratives across different genres, from fantasy to mystery.",
    type: "chat",
    featured: false,
  },

  {
    id: 12,
    name: "Prompt Generator",
    desc: "Generate creative prompts for writing, art, and other creative projects.",
    image: require("../assets/images/agent_4.png"),
    initialText: "Can you give me a writing prompt for a sci-fi story?",
    prompt:
      "You are a prompt generator. Help users brainstorm creative prompts for writing, art, programming, or other creative activities. Tailor prompts to different genres, themes, and moods.",
    type: "chat",
    featured: false,
  },
];
