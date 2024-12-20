import JWTService from "./JWTService";

class CalculatorAPIService {

    api_base_url = import.meta.env.VITE_API_BASE_URL;
    admin_api_key = import.meta.env.VITE_ADMIN_API_KEY;

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

    async fetchAvailableOps() {
        try {
            const response = await fetch(`${this.api_base_url}/api/v1/operations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWTService.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch available operations");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch available operations:", error);
        }
    }

    async fetchCalculationHistory(page, pageSize) {
        const results = [];
        let totalRecords = 0;
        let moreRecords = true;

        try {
            
            while (moreRecords) {
                const queryString = `page=${page}&page_size=${pageSize}`;

                const response = await fetch(`${this.api_base_url}/api/v1/calculations?${queryString}`, {
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

                results.push(...data.results);
                totalRecords = data.metadata.total;

                page += 1;
                moreRecords = results.length < totalRecords;
            }
        } catch (error) {
            console.error("Failed to fetch calculation history:", error);
        }

        return {"results": results, "total" : totalRecords};
    }

    async deleteCalculation(id) {
        const response = await fetch(`${this.api_base_url}/api/v1/calculations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.admin_api_key}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete calculation");
        }

        return true;
    }

    async requestCalculation(opType, operands) {

        const payload = {
            "operation": opType,
            "operands": operands,
        };

        try {
            const response = await fetch(`${this.api_base_url}/api/v1/calculations/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWTService.getToken()}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to request calculation: ${data.error}`);
            }

            return data;
        } catch (error) {
            console.error("Calculation failed:", error);
            throw error;
        }

    }

}

export default new CalculatorAPIService();