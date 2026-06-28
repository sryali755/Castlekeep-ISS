# Quick Start Guide — Automated Offer Test Plan Generator

## 5-Minute Setup

### 1. Install Dependencies

```bash
cd ~/Library/CloudStorage/OneDrive-Comcast/Desktop/castlekeep
pip install openpyxl
```

### 2. Run with Sample Data

```bash
python3 test_plan_generator.py sample_castleskeep_response.json --output-dir ./test_plans
```

**Expected output:**
- File: `test_plans/Atlas_Offer_Test_Plan_ISS0001146C.xlsx`
- Summary: 2 offers, 10 total test cases (5 positive, 5 negative)

### 3. Open the Excel File

The workbook includes 5 sheets:
- **Executive Summary** — High-level metrics
- **Offer Summary** — All offers with test counts
- **Positive Test Cases** — Green-highlighted test scenarios
- **Negative Test Cases** — Red-highlighted failure scenarios
- **All Test Cases** — Interleaved by offer

---

## Typical Workflow

### Step 1: Get Offer Data from CastleKeep Bridge

```bash
curl -X POST http://castleskeep-bridge:8000/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"ticket_number": "ISS0001146C"}' \
  > castleskeep_response.json
```

### Step 2: Generate Test Plan

```bash
python3 test_plan_generator.py castleskeep_response.json --output-dir ./test_plans
```

### Step 3: Upload Excel to Ticket

Attach `Atlas_Offer_Test_Plan_ISS0001146C.xlsx` to your Atlas request ticket for the E2E testing team.

---

## Command Reference

### Basic Usage

```bash
python3 test_plan_generator.py <input_json> [--output-dir <dir>]
```

### Examples

**Generate with default output directory (current dir):**
```bash
python3 test_plan_generator.py castleskeep_response.json
```

**Specify output directory:**
```bash
python3 test_plan_generator.py castleskeep_response.json --output-dir ~/Documents/test_plans
```

**Help:**
```bash
python3 test_plan_generator.py --help
```

---

## Input Format

The generator accepts JSON from the CastleKeep Bridge:

```json
{
  "success": true,
  "ticket_number": "ISS0001146C",
  "business_strategy": "Retention 2.0",
  "request_name": "Q2 2024 Offers",
  "record_count": 6,
  "data": [
    {
      "offer_id": "OFR-12001",
      "offer_name": "$49.99 Internet 12mo",
      "u_other_eligibility": "CALL_CENTER_POS|RETENTION_TELESALES|...",
      "dv_sales_channel": "CALL_CENTER_POS,RETENTION_TELESALES",
      "price_step_1_value": "$49.99",
      "price_step1_duration": "12",
      "dv_price_step1_type": "Fixed",
      "division": "CENTRAL",
      ...
    },
    ...
  ]
}
```

---

## Offer Types & Test Cases

### Group A (Standard Offers)

Offers **without** `CUSTOM_FIELD03_HSE` tag

**Test cases:** 2 positive + 3 negative = **5 per offer**

- POS-001: RETENTION_TELESALES channel ✓
- POS-002: RETENTION-TEST_TELES channel ✓
- NEG-001: Wrong channel (ONLINE) ✗
- NEG-002: Business customer type ✗
- NEG-003: Wrong division (if not National) ✗

### Group B (Strategic Offers)

Offers **with** `CUSTOM_FIELD03_HSE:1xxx` tag (position 1 = '1')

**Test cases:** 3 positive + 4 negative = **7 per offer**

- POS-001: Correct tag via RETENTION_TELESALES ✓
- POS-002: Correct tag via RETENTION-TEST_TELES ✓
- POS-003: XM-New with discount ✓
- NEG-001: Missing CUSTOM_FIELD03_HSE tag ✗
- NEG-002: Tag with position 1 = '0' (wrong value) ✗
- NEG-003: Correct tag but wrong channel ✗
- NEG-004: Correct tag but wrong division (if not National) ✗

---

## Test Case Columns

### Positive Tests (15 columns)

| Test ID | Test Type | Offer ID | Offer Name | Description | Customer Status | Customer Type | Customer Tags | Sales Channel | Division | Tenure Days | Existing Services | Speed Tier | Expected Result | Validation Points |

### Negative Tests (16 columns)

| Same as above | + Failure Reason |

---

## Excel Sheet Reference

| Sheet | Purpose | Rows | Color |
|-------|---------|------|-------|
| **Executive Summary** | High-level metrics | 20 | Navy (#1F4E78) |
| **Offer Summary** | All offers + test counts | N offers + 1 | Blue (#4472C4) |
| **Positive Tests** | All positive test cases | N tests | Green (#00B050) |
| **Negative Tests** | All negative test cases | N tests | Red (#C00000) |
| **All Tests** | Interleaved, color-coded | 2N tests | Navy (#203864) |

All sheets have:
- ✓ Frozen header row (row 1)
- ✓ Auto-fitted columns
- ✓ Text wrapping enabled
- ✓ Professional formatting (Calibri, 10pt)

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "File not found" | Check file path, use absolute path if needed |
| "openpyxl not installed" | Run `pip install openpyxl` |
| Output file not created | Ensure output directory exists: `mkdir -p ./test_plans` |
| Offers classified wrong | Verify `u_other_eligibility` format (see docs) |
| Missing test cases | Check offer has `offer_id`, `offer_name`, `u_other_eligibility` |

---

## Output Naming

Test plan files are named: `Atlas_Offer_Test_Plan_[TICKET_NUMBER].xlsx`

Example:
```
Atlas_Offer_Test_Plan_ISS0001146C.xlsx
Atlas_Offer_Test_Plan_ISS0001147A.xlsx
```

---

## Next Steps

1. **Test the sample:** Run `python3 test_plan_generator.py sample_castleskeep_response.json`
2. **Review the Excel:** Open the generated workbook and check formatting
3. **Integrate with CastleKeep Bridge:** Use the Bridge to fetch real offer data
4. **Automate in Writer:** Add generator to your Writer Agent workflow
5. **Share with E2E Team:** Upload Excel to ticket for test execution

---

## Performance

- **Small plans** (2-5 offers): <1 second
- **Medium plans** (10-30 offers): 1-3 seconds
- **Large plans** (50+ offers): 5-10 seconds

---

## Support

- **Questions about usage?** See [GENERATOR_README.md](GENERATOR_README.md)
- **CastleKeep DB issues?** Contact Ashley Davan
- **Integration help?** Contact Writer implementation team

---

## Sample Output Structure

```
castlekeep/
├── test_plan_generator.py          ← Main script
├── sample_castleskeep_response.json ← Example input
├── requirements.txt                 ← Python dependencies
├── GENERATOR_README.md              ← Full documentation
├── QUICK_START.md                   ← This file
└── test_plans/                      ← Output directory
    └── Atlas_Offer_Test_Plan_ISS0001146C.xlsx
```

---

**Ready to generate your first test plan!** 🚀
