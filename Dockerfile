# # Use the official Node.js image as a base
# FROM node:14

# # Install C++ and Java compilers
# RUN apt-get update && \
#     apt-get install -y g++ openjdk-11-jdk && \
#     apt-get clean

# # Verify the installation of g++ and javac (optional, to confirm)
# RUN g++ --version && javac -version

# # Set the working directory in the container
# WORKDIR /app

# # Copy the backend files into the container
# COPY backend/ /app/backend

# # Set the working directory to the backend folder
# WORKDIR /app/backend

# # Install backend dependencies
# RUN npm install

# # Expose the port your app will run on (port 3001)
# EXPOSE 3001

# # Command to run the backend server
# CMD ["node", "server.js"]


# Use the official Node.js 14 image
FROM node:14

# Install C++ and Java compilers
RUN apt-get update && \
    apt-get install -y g++ openjdk-11-jdk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Optional: verify installations
RUN g++ --version && javac -version

# Set the working directory
WORKDIR /app

# Copy backend files only
COPY backend/ ./backend

# Go into backend directory
WORKDIR /app/backend

# Install dependencies
RUN npm install

# Expose backend port
EXPOSE 3001

# Run backend server
CMD ["node", "server.js"]
