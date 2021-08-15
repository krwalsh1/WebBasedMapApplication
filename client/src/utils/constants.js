import ulog from "ulog";

function setLogLevelIfDefault() {
    const urlString = window.location.search;
    const urlParams = new URLSearchParams(urlString);
    if(!urlParams.has("log")) {
        ulog.level = ulog.ERROR
    }
}

setLogLevelIfDefault();

export const LOG = ulog("App");

export const CLIENT_TEAM_NAME = "T18 progRAMmers";

export const MISSION_STATEMENT = "From the moment the progRAMmers were first assembled it was certain that each of us possessed formidable and fluid characteristics that every excellent team is made of. Even though the road ahead is marked with unfamiliar challenges in the midst of a pandemic, we possess the discipline that will undoubtedly see it through. As a team of software engineers, we are dedicated to delivering products that we can proudly stand behind. We do more than just write software. We design, build, and deploy solutions aimed at the toughest problems across the globe."

export const MICHAEL_BIO = "I'm a junior Computer Science and Statistics student at CSU. I am originally from Colorado Springs, CO and got started in technology in various high school courses. I started with a simple interest making small programs that turned into a wider scope including data science and cybersecurity. Aside from using computers, my interests spread into more active hobbies such as spikeball, ultimate frisbee, and bowling. I hope to one day work within the world of sports statistics whether that be on a professional team or in a third-partty company."
export const CHASE_BIO = "I'm a junior computer science student at CSU. I am from Fort Collins and have always been interested in technology and transportation logistics. My first real desktop computer I custom built after many years of working with computers that did not work too well and learned that I really like to use technology and put things together. Building my desktop helped me decide that I wanted to learn how to code and make many different projects all work together."
export const JACOB_BIO = "I'm a 5th year Mechanical Engineering student. It's strange, but I absolutely love school! I recently got married to the most amazing woman, Amber, and am learning how to balance the demands of school and life in the recent transition. We live in an apartment just West of campus hopefully with a dog soon. I have an inquisitive entrepreneurial spirit. I am currently developing a regenerative shock absorber for my senior design project next and am hoping to patent it pending the results of testing this fall. We shall see=). I can't wait for what the future holds!"
export const KORBIN_BIO = "I grew up in Durango, Colorado, a small mountain town in the Southwest corner of the state. Although it may be known for it's hiking/biking trails, ski slopes, and beauty, I often found myself more interested in what was going on in my computer. It was that interest that led me to choose a degree in Computer Science. This semester I'll be a junior, and while I may be a semester behind I think that gives me some extra time to develop my programming skills to a level where I feel more comfortable. After graduating, I have aspirations to go out to the East coast to start a career. There, I plan on starting out in software engineering/development and then slowly moving into the cybersecurity field as I amass experience. I'm not sure what the future holds, but I plan on taking it in stride."
export const ALEC_BIO = "I’m a senior computer science student here at CSU. My first computer had Windows 98 and dial-up internet which might seem crazy to think about, but technology is so relative I’ll probably look back at what I have now in 20 years and think something similar. Aside from computers my number one hobby is fishing, I hope to explore and fly fish as much of the Rocky Mountain’s natural waterways as I can after college before settling down. An interesting fact about me is that I have gone camping in Colorado well over a hundred times."

export const EARTH_RADIUS_UNITS_DEFAULT = {"miles": 3959};

export const PROTOCOL_VERSION = 1;

export const HTTP_OK = 200;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_INTERNAL_SERVER_ERROR = 500;
