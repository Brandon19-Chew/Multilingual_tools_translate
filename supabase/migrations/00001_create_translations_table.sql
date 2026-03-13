-- Create translations table for storing translation history
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  detected_language VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (no auth required)
CREATE POLICY "Allow all operations on translations" ON translations
  FOR ALL
  USING (true)
  WITH CHECK (true);