variable "region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy"
}

variable "key_name" {
  type        = string
  default     = "node-security"
  description = "Key name use to connect to instance"
}

variable "backend_port" {
  type        = number
  default     = 3001
  description = "Backend port used in api"
}

variable "docker_image" {
  type        = string
  default     = "mja123/node-security"
  description = "Full docker image name"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag"
}

