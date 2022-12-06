import { MongoClient } from "mongodb";
import { Fragment } from "react";
import Layout from "../components/layout/Layout";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1200px-New_york_times_square-terabass.jpg",
    address: "New York Times Square",
    description: "This is a first meetup",
  },
  {
    id: "m2",
    title: "A Second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1200px-New_york_times_square-terabass.jpg",
    address: "New York Times Square",
    description: "This is a 2nd meetup",
  },
];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a huge list of highly active React Meetups"/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}
// *********************************************************************
//////////////**************** GET static props************** */
// basically our aim is SEO search engine optimization, so we use the following method so that the
// server renders the complete data of our page instead of rendering  an almost empty file which is
//usually the case in react propjects and is very bad for SEO
export async function getStaticProps() {
  // the code in here will never reach the machine of your visitors
  // fetch data from API or Database.
  const client = await MongoClient.connect(
    "mongodb+srv://abdulrab:syedabdulrab@cluster0.mqegjo3.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        id: meetup._id.toString(),
        image: meetup.image,
        address: meetup.address,
      })),
    },
    revalidate: 10,
    // this page will not just be generated at the build process but it will also be generated every couple of seconds on the server if there are reqs coming in for this page and
    //then these regenerated pages will tae place of the pregenerated pages and in this way u can make sure that ur data is not older than 10 seconds
  };
  // u always need to return an object here
}
// this only works in page component files
//***************************************************************************

export default HomePage;

// there is an alternative to get static props and that is get erver side rendering an that can be used when u wish to rerender the entire webpage on every incoming
// request instead of only when the site is being buiot and after every couple of seconds

// *****************************************************************************
// // *****************GET SERVER SIDE PROPS*********************************
// // use this when ur data changes all the time and you neeed access to the REQUEST object for authentication or whatever
// export async function getServerSideProps(context) {
//     // this function will not run in the build process u always on the server
//    // any code u write here will alwyas run on theserver and never on the users device

//    const req = context.req;
//    const res = context.res;
// //    console.log(req,res)

//    return {
//         props:{
//             meetups: DUMMY_MEETUPS,
//         }
//         // there is no need to use revalidate here because it will always run after every inoing request and hence there is no need to run it after every x seconds
//     }
// }
// ////// *********************************************************//
