import { createClient } from 'redis';
import bcrypt from 'bcryptjs';

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis Client Connected');
                this.isConnected = true;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }

    // Store OTP with user data in Redis with TTL
    async storeOTP(email, userData, ttlSeconds = 600) { // Default 10 minutes
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const key = `otp:${email}`;
            const data = {
                username: userData.username,
                fullname: userData.fullname,
                email: userData.email,
                password: userData.password, // Already hashed
                otp: userData.otp,
                createdAt: new Date().toISOString()
            };

            await this.client.setEx(key, ttlSeconds, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error storing OTP in Redis:', error);
            throw error;
        }
    }

    // Get OTP data from Redis
    async getOTP(email) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const key = `otp:${email}`;
            const data = await this.client.get(key);
            
            if (!data) {
                return null;
            }

            return JSON.parse(data);
        } catch (error) {
            console.error('Error getting OTP from Redis:', error);
            throw error;
        }
    }

    // Delete OTP from Redis
    async deleteOTP(email) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const key = `otp:${email}`;
            const result = await this.client.del(key);
            return result > 0;
        } catch (error) {
            console.error('Error deleting OTP from Redis:', error);
            throw error;
        }
    }

    // Check if OTP exists and is valid
    async verifyOTP(email, otp) {
        try {
            const data = await this.getOTP(email);
            
            if (!data) {
                return { valid: false, message: "No pending registration found. Please register first." };
            }

            if (data.otp !== otp) {
                return { valid: false, message: "Invalid OTP" };
            }

            return { valid: true, data };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    }

    // Update OTP for resend functionality
    async updateOTP(email, newOTP, ttlSeconds = 600) {
        try {
            const existingData = await this.getOTP(email);
            
            if (!existingData) {
                return { success: false, message: "No pending registration found for this email. Please register first." };
            }

            const updatedData = {
                ...existingData,
                otp: newOTP,
                createdAt: new Date().toISOString()
            };

            await this.storeOTP(email, updatedData, ttlSeconds);
            return { success: true, message: "OTP updated successfully" };
        } catch (error) {
            console.error('Error updating OTP:', error);
            throw error;
        }
    }

    // Check if Redis is connected
    isRedisConnected() {
        return this.isConnected;
    }
}

// Create singleton instance
const redisService = new RedisService();

export default redisService;
