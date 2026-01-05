import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work, Room } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Joris",
  lastName: "Stocker",
  name: `Joris Stocker`,
  role: "Fullstack Developer",
  avatar: "/images/avatar.jpg",
  email: "joris.stocker@gmail.com",
  location: "Europe/Paris", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["French", "English"], // optional: Leave the array empty if you don't want to display languages
  technologies: [
    {
      category: "Programming Languages",
      items: [
        { name: "JavaScript", icon: "/images/icons/plang/JavaScript.svg" },
        { name: "Python", icon: "/images/icons/plang/Python.svg" },
        { name: "PHP", icon: "/images/icons/plang/PHP.svg" },
        { name: "Java", icon: "/images/icons/plang/Java.svg" },
      ],
    },
    {
      category: "Frameworks & Libraries",
      items: [
        { name: "React", icon: "/images/icons/React.svg" },
        { name: "Symfony", icon: "/images/icons/Symfony.svg" },
        { name: "Node.js", icon: "/images/icons/plang/Node.js.svg" },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "MySQL", icon: "/images/icons/MySQL.svg" },
        { name: "PostgreSQL", icon: "/images/icons/PostgresSQL.svg" },
      ],
    },
    {
      category: "DevOps & Tools",
      items: [
        { name: "Docker", icon: "/images/icons/Docker.svg" },
        { name: "Git", icon: "/images/icons/Git.svg" },
        { name: "Jenkins", icon: "/images/icons/Jenkins.svg" },
        { name: "Jira", icon: "/images/icons/Jira.svg" },
        { name: "VS Code", icon: "/images/icons/VSCode.svg" },
      ],
    },
    {
      category: "Operating Systems",
      items: [
        { name: "Linux", icon: "/images/icons/Linux.svg" },
        { name: "Windows", icon: "/images/icons/Windows11.svg" },
      ],
    },
    {
      category: "Web Technologies",
      items: [
        { name: "HTML5", icon: "/images/icons/HTML5.svg" },
        { name: "CSS3", icon: "/images/icons/CSS3.svg" },
      ],
    },
  ],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Bypus/",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/joris-stocker-a21328b2/",
    essential: true,
  },
  // {
  //   name: "Instagram",
  //   icon: "instagram",
  //   link: "https://www.instagram.com/once_ui/",
  //   essential: false,
  // },
  // {
  //   name: "Threads",
  //   icon: "threads",
  //   link: "https://www.threads.com/@once_ui",
  //   essential: true,
  // },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Software developer and builder</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Banko Perso</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-banko-perso",
  },
  subline: (
    <>
      I'm Joris, a passionate software developer dedicated to creating impactful
      products and seamless user experiences.
      <br />
      Outside of work, I channel my creativity into building personal projects
      that push my skills further.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Developer based in Grenoble, with experience in fullstack development
        and DevOps. Specializes in modernizing systems, improving user
        experiences, and integrating technology to solve complex challenges
        efficiently.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Topela",
        timeframe: "2024 - 2025",
        role: "Fullstack Developer",
        tags: [
          {
            name: "PHP",
            icon: "php",
          },
          {
            name: "GCP",
            icon: "googlecloud",
          },
          {
            name: "Symfony",
            icon: "symfony",
          },
          {
            name: "Node.js",
            icon: "nodedotjs",
          },
        ],
        achievements: [
          <>
            Complete modernization of a <strong>Symfony</strong> 3 application
            to version 7 with migration from <strong>PHP</strong> 7 to 8.
          </>,
          <>
            Front-end upgrade: integration of SCSS, Twig, and a build system
            based on <strong>Node.js</strong> (Gulp).
          </>,
          <>Replacement of the payment module.</>,
          <>Improvement of user session management.</>,
          <>
            Redesign of the architecture: updating dependencies, strengthening
            security, and improving maintainability.
          </>,
          <>
            Deployment and containerization with <strong>Docker</strong> and{" "}
            <strong>Google App Engine</strong>.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/topela/tope-la.png",
            alt: "tope-la front page",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Linnea",
        timeframe: "2023 - 2024",
        role: "Fullstack Developer",
        tags: [
          {
            name: "PHP",
            icon: "php",
          },
        ],
        achievements: [
          <>
            Creation of a product sheet evaluation module in Front/Back within
            an internal <strong>PHP</strong> framework.
          </>,
          <>
            Practice of <strong>CI/CD</strong> in a team.
          </>,
          <>Implementation of a review sorting system.</>,
        ],
        images: [
          {
            src: "/images/projects/linnea/linnea_score.png",
            alt: "internal scoring tool",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/linnea/linnea_review.png",
            alt: "external review tool",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Keolabs",
        timeframe: "2017 - 2023",
        role: "DevOps Manager",
        tags: [
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "Jenkins",
            icon: "jenkins",
          },
          {
            name: "Scrum",
            icon: "scrum",
          },
        ],
        achievements: [
          <>
            Maintenance and improvement of calibration and quality validation
            test suites using <strong>Python</strong> and <strong>C#</strong>.
          </>,
          <>
            Unification of two package build systems (<strong>Python</strong>,{" "}
            <strong>Perl</strong>, <strong>C++</strong>) through pair
            programming and mob programming.
          </>,
          <>
            Implementation of <strong>CI/CD</strong> pipelines with{" "}
            <strong>Jenkins</strong> and <strong>Ansible</strong>, managing a
            virtual machine system.
          </>,
          <>
            Development and maintenance of <strong>Python</strong> libraries for
            test instrument control (oscilloscopes, signal generators...), with{" "}
            <strong>unit testing</strong>.
          </>,
          <>
            Optimization of tests by integrating new standards and improving
            databases with <strong>Django</strong>.
          </>,
          <>
            Refactoring and optimizing internal <strong>Python</strong> scripts.
          </>,
        ],
        images: [
          {
            src: "/images/projects/keolabs/keolabs_spy.jpg",
            alt: "external review tool",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Associate’s Degree in Computer Science",
        description: (
          <>
            UGA - France - <strong>Bac +2</strong>
          </>
        ),
      },
      {
        name: "Bachelor’s Degree in Web Development",
        description: (
          <>
            UGA - France - <strong>Bac +3</strong>
          </>
        ),
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: (
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
        ),
        // tags: [
        //   {
        //     name: "Figma",
        //     icon: "figma",
        //   },
        // ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: (
          <>Building next gen apps with Next.js.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

import imageList from "./gallery.json";
const imagesFolder = "/images/gallery/";

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: imageList.map((image) => ({
    src: `${imagesFolder}${image.file}`,
    alt: image.file,
    orientation: image.orientation,
  })),
};

const room: Room = {
  path: "/room",
  label: "Room",
  title: "Rooming about design and tech...",
  description: `Read what ${person.name} has been rooming recently`,
};

// const game: Game = {
//   label: "Game",
//   title: "Gaming about design and tech...",
//   description: `Read what ${person.name} has been gaming recently`,
// };

export { person, social, newsletter, home, about, blog, work, gallery, room };
