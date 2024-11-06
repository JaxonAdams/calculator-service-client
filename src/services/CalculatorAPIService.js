import JWTService from "./JWTService";

class CalculatorAPIService {

    api_base_url = import.meta.env.VITE_API_BASE_URL;

    async fetchUserBalance() {
        try {
            const response = await fetch(`${this.api_base_url}/api/v1/users/balance`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWTService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch balance");
            }

            const data = await response.json();
            return parseFloat(data.balance);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    }

    async fetchCalculationHistory() {
        try {
            const response = await fetch(`${this.api_base_url}/api/v1/calculations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWTService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch calculation history");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch calculation history:", error);
        }
    }

}

export default new CalculatorAPIService();