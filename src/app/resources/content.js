import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Joris",
  lastName: "Stocker",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Fullstack Developer",
  avatar: "/images/avatar.jpg",
  location: "Europe/Paris", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["French", "English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Bypus/",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/joris-stocker-a21328b2/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:joris.stocker@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Software developer and builder</>,
  subline: (
    <>
      I'm Joris, a software developer{/* <InlineCode></InlineCode> */}. I craft helpful products and
      <br /> user experiences. After hours, I build my own projects.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
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
        Joris is a developer based in Grenoble, with experience in fullstack development and DevOps. 
        He specializes in modernizing systems, improving user experiences, 
        and integrating technology to solve complex challenges efficiently.
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
        achievements: [
          <>
            Complete modernization of a <strong>Symfony</strong> 3 application to version 7 with migration from <strong>PHP</strong> 7 to 8.
          </>,
          <>
            Front-end upgrade: integration of SCSS, Twig, and a build system based on <strong>Node.js</strong> (Gulp).
          </>,
          <>
            Replacement of the payment module.
          </>,
          <>
            Improvement of user session management.
          </>,
          <>
            Redesign of the architecture: updating dependencies, strengthening security, and improving maintainability.
          </>,
          <>
            Deployment and containerization with <strong>Docker</strong> and <strong>Google App Engine</strong>.
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
        achievements: [
          <>
            Creation of a product sheet evaluation module in Front/Back within an internal <strong>PHP</strong> framework.
          </>,
          <>
            Practice of <strong>CI/CD</strong> in a team.
          </>,
          <>
            Implementation of a review sorting system.
          </>,
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
        achievements: [
          <>
            Maintenance and improvement of calibration and quality validation test suites using <strong>Python</strong> and <strong>C#</strong>.
          </>,
          <>
            Unification of two package build systems (<strong>Python</strong>, <strong>Perl</strong>, <strong>C++</strong>) through pair programming and mob programming.
          </>,
          <>
            Implementation of <strong>CI/CD</strong> pipelines with <strong>Jenkins</strong> and <strong>Ansible</strong>, managing a virtual machine system.
          </>,
          <>
            Development and maintenance of <strong>Python</strong> libraries for test instrument control (oscilloscopes, signal generators...), with <strong>unit testing</strong>.
          </>,
          <>
            Optimization of tests by integrating new standards and improving databases with <strong>Django</strong>.
          </>,
          <>
            Refactoring and optimizing internal <strong>Python</strong> scripts.
          </>
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
        name: "University of Grenoble Alpes - IUT2",
        description: <>Studied software engineering.</>,
      },
      {
        name: "University of Grenoble Alpes - IUT1",
        description: <>Studied web development.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Programming Languages",
        description: (
          <>
            <img src="/images/icons/Python.svg" alt="Python" width="32" height="32" /> 
            <img src="/images/icons/JavaScript.svg" alt="JavaScript" width="32" height="32" /> 
            <img src="/images/icons/Node.js.svg" alt="Node.js" width="32" height="32" /> 
            <img src="/images/icons/PHP.svg" alt="PHP" width="32" height="32" /> 
            <img src="/images/icons/Java.svg" alt="Java" width="32" height="32" /> 
          </>
        ),
      },
      {
        title: "Frameworks & Libraries",
        description: (
          <>
            <img src="/images/icons/React.svg" alt="React" width="32" height="32" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 66 64" width="32" height="32">
              <circle fill="#1A171B" cx="32" cy="32" r="32" stroke="#FFF" strokeWidth="2"></circle>
              <path fill="#FFF" d="M46.644 12.219c-3.297.115-6.175 1.932-8.317 4.446-2.372 2.756-3.95 6.025-5.087 9.362-2.034-1.667-3.603-3.825-6.866-4.766-2.522-.724-5.171-.425-7.607 1.39-1.154.862-1.949 2.165-2.327 3.39-.979 3.183 1.029 6.016 1.941 7.033l1.994 2.137c.411.419 1.401 1.512.917 3.079-.523 1.704-2.577 2.807-4.684 2.157-.941-.287-2.293-.988-1.99-1.975.125-.404.414-.706.569-1.055.142-.3.21-.525.253-.657.385-1.257-.141-2.892-1.487-3.307-1.256-.385-2.541-.08-3.039 1.537-.565 1.837.314 5.171 5.023 6.623 5.517 1.695 10.184-1.309 10.846-5.227.417-2.454-.691-4.277-2.721-6.622l-1.654-1.829c-1.002-1.001-1.346-2.707-.309-4.018.875-1.106 2.121-1.578 4.162-1.023 2.979.809 4.307 2.876 6.523 4.543-.915 3.001-1.513 6.013-2.054 8.714l-.33 2.014c-1.584 8.308-2.793 12.87-5.935 15.489-.633.45-1.538 1.124-2.902 1.171-.715.022-.946-.47-.956-.684-.017-.502.406-.732.687-.958.42-.229 1.055-.609 1.012-1.826-.046-1.438-1.237-2.685-2.959-2.628-1.29.044-3.256 1.258-3.182 3.48.077 2.295 2.216 4.015 5.441 3.906 1.724-.059 5.574-.761 9.368-5.271 4.416-5.17 5.651-11.097 6.58-15.435l1.037-5.727c.576.069 1.192.115 1.862.131 5.5.116 8.251-2.733 8.292-4.805.027-1.254-.823-2.488-2.013-2.46-.852.024-1.922.591-2.179 1.769-.251 1.156 1.75 2.199.186 3.212-1.111.719-3.103 1.226-5.908.814l.51-2.819c1.041-5.346 2.325-11.922 7.196-12.082.355-.018 1.654.016 1.684.875.009.287-.062.36-.398 1.017-.342.512-.471.948-.455 1.449.047 1.365 1.085 2.262 2.586 2.208 2.01-.065 2.588-2.022 2.555-3.027-.081-2.361-2.57-3.853-5.865-3.745z"></path>
            </svg>
          </>
        ),
      },
      {
        title: "Databases",
        description: (
          <>
            <img src="/images/icons/PostgresSQL.svg" alt="PostgreSQL" width="32" height="32" />
            <img src="/images/icons/MySQL.svg" alt="MySQL" width="32" height="32" />
          </>
        ),
      },
      {
        title: "DevOps & Tools",
        description: (
          <>
            <img src="/images/icons/Docker.svg" alt="Docker" width="32" height="32" />
            <img src="/images/icons/Git.svg" alt="Git" width="32" height="32" />
            <img src="/images/icons/Linux.svg" alt="Linux" width="32" height="32" />
            <img src="/images/icons/Apache Subversion.svg" alt="Apache Subversion" width="32" height="32" />
          </>
        ),
      },
      {
        title: "Development Environments",
        description: (
          <>
            <img src="/images/icons/JetBrains.svg" alt="JetBrains" width="32" height="32" />
            <img src="/images/icons/Visual Studio Code (VS Code).svg" alt="VS Code" width="32" height="32" />
          </>
        ),
      },
      {
        title: "Operating Systems",
        description: (
          <>
            <img src="/images/icons/Windows 11.svg" alt="Windows 11" width="32" height="32" />
            <img src="/images/icons/Linux.svg" alt="Linux" width="32" height="32" />
          </>
        ),
      },
      {
        title: "Web Technologies",
        description: (
          <>
            <img src="/images/icons/HTML5.svg" alt="HTML5" width="32" height="32" />
            <img src="/images/icons/CSS3.svg" alt="CSS3" width="32" height="32" />
          </>
        ),
      },
      // {
      //   title: "Next.js",
      //   description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
      //   // optional: leave the array empty if you don't want to display images
      //   images: [
      //     {
      //       src: "/images/projects/project-01/cover-04.jpg",
      //       alt: "Project image",
      //       width: 16,
      //       height: 9,
      //     },
      //   ],
      // },
    ],
  },
  // hobbies: {
  //   display: true, // set to false to hide this section
  //   title: "Hobbies",
  //   institutions: [
  //     {
  //       name: "University of Grenoble Alpes - IUT2",
  //       description: <>Studied software engineering.</>,
  //     },
  //     {
  //       name: "University of Grenoble Alpes - IUT1",
  //       description: <>Studied web development.</>,
  //     },
  //   ],
  // },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const test = {
  label: "Test",
  title: "Testing about design and tech...",
  description: `Read what ${person.name} has been testing recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  images: [],
};

import imageList from "./gallery.json";

const imagesFolder = "/images/gallery/";

// Charger les images depuis le fichier JSON
imageList.forEach((image) => {
  gallery.images.push({
    src: `${imagesFolder}${image.file}`,
    alt: image.file,
    orientation: image.orientation,
  });
});

export { person, social, newsletter, home, about, blog, test, work, gallery };
