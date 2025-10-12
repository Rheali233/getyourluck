
#!/bin/bash

# Script to run DISC and Leadership test optimization migrations
# This script applies the new professional question sets

echo "🚀 Starting Career Test Optimization Migrations..."

# Set the database path (adjust as needed for your environment)
DB_PATH="./comprehensive-testing-platform.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "❌ Database not found at $DB_PATH"
    echo "Please ensure you're running this from the correct directory"
    exit 1
fi

echo "📊 Database found at $DB_PATH"

# Run DISC optimization migration
echo "🔄 Applying DISC test optimization migration..."
sqlite3 "$DB_PATH" < ./migrations/019_optimize_disc_questions.sql

if [ $? -eq 0 ]; then
    echo "✅ DISC test optimization completed successfully"
else
    echo "❌ DISC test optimization failed"
    exit 1
fi

# Run Leadership optimization migration
echo "🔄 Applying Leadership test optimization migration..."
sqlite3 "$DB_PATH" < ./migrations/020_optimize_leadership_questions.sql

if [ $? -eq 0 ]; then
    echo "✅ Leadership test optimization completed successfully"
else
    echo "❌ Leadership test optimization failed"
    exit 1
fi

# Verify the changes
echo "🔍 Verifying question counts..."

DISC_COUNT=$(sqlite3 "$DB_PATH" "SELECT question_count FROM psychology_question_categories WHERE id = 'disc-category';")
LEADERSHIP_COUNT=$(sqlite3 "$DB_PATH" "SELECT question_count FROM psychology_question_categories WHERE id = 'leadership-category';")

echo "📈 DISC questions: $DISC_COUNT (was 20, now 30)"
echo "📈 Leadership questions: $LEADERSHIP_COUNT (was 25, now 30)"

echo "🎉 All optimizations completed successfully!"
echo ""
echo "📋 Summary of improvements:"
echo "   • DISC test: 20 → 30 questions (+10 professional questions)"
echo "   • Leadership test: 25 → 30 questions (+5 professional questions)"
echo "   • Added situational and pressure scenarios"
echo "   • Implemented question weighting system"
echo "   • Enhanced question quality and relevance"
