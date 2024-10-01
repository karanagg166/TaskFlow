import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-600  text-white pt-40 pb-10 text-center ">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <Typography variant="h2" className="text-5xl font-extrabold mb-6 tracking-widest">
      Task Management Hub
    </Typography>
    <Typography variant="h6" className="mb-6 max-w-2xl mx-auto text-lg">
      Effortlessly manage tasks, collaborate with your team, and stay organized.
    </Typography>
    <Button
      variant="contained"
      className="bg-white text-indigo-600 hover:bg-gray-200 transition duration-300 rounded-full px-6 py-2 text-lg shadow-lg"
      component={Link}
      to="/user/login"
    >
      Get Started
    </Button>
  </motion.div>
</section>


      {/* Features Section */}
      <Container className="py-20">
        <Typography
          variant="h4"
          className="text-center mb-12 text-gray-800 font-extrabold tracking-wide text-4xl"
        >
          Key Features
        </Typography>

        <Grid container spacing={6} justifyContent="center">
          {[
            {
              title: 'Create Groups',
              description: 'Form groups for different projects and manage tasks collectively with your team.',
              color: 'from-blue-100 to-blue-200',
            },
            {
              title: 'Assign Tasks',
              description: 'Assign tasks to users, set deadlines, and track progress seamlessly.',
              color: 'from-green-100 to-green-200',
            },
            {
              title: 'Track Progress',
              description: 'Monitor the status of tasks and ensure timely completion with clear reporting.',
              color: 'from-yellow-100 to-yellow-200',
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.div
                whileHover={{
                  background: `linear-gradient(to bottom right, ${item.color})`,
                }}
                transition={{ duration: 0.4 }}
                className={`p-8 rounded-lg shadow-lg bg-gradient-to-br ${item.color} transition-all duration-300 transform hover:shadow-xl hover:scale-105`}
              >
                <Paper className="rounded-lg">
                  <Typography variant="h5" className="font-bold mb-3 text-center">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" className="text-center">
                    {item.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Organized Section */}
      <Container className="py-16 bg-gray-100">
        <Typography
          variant="h4"
          className="text-center mt-10 mb-8 text-gray-800 font-extrabold tracking-wide text-3xl"
        >
          Stay Organized
        </Typography>

        <Grid container spacing={6}>
          {[
            {
              title: 'Group Projects',
              description: 'Collaborate with your team on group projects, share updates, and ensure accountability.',
              color: 'from-indigo-100 to-indigo-200',
            },
            {
              title: 'Generate Reports',
              description: 'Generate detailed reports on task progress, completion rates, and group activity.',
              color: 'from-red-100 to-red-200',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                whileHover={{
                  background: `linear-gradient(to bottom right, ${item.color})`,
                }}
                transition={{ duration: 0.4 }}
                className={`shadow-lg border-0 bg-gradient-to-br ${item.color} rounded-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300`}
              >
                <Card className="rounded-lg">
                  <CardContent>
                    <Typography variant="h6" className="font-bold text-lg">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="text-md">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" className="hover:text-indigo-500">
                      View {item.title}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <Container>
          <Typography variant="body2" className="text-center text-gray-300">
            © 2024 Task Management Hub. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
