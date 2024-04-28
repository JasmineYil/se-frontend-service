# Use an official nginx image as a parent image
FROM nginx:alpine

# Copy static content into place
COPY frontend /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 9091 to be accessible externally
EXPOSE 9091

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
