# Use an official nginx image as a parent image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy static content into place
COPY frontend /usr/share/nginx/html

# Expose port 80 to be accessible externally
EXPOSE 9095

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
