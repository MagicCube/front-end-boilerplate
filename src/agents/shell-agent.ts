let cwd = process.cwd();

export async function exec(command: string, args: string[]) {
  const { execa } = await import('execa');
  return await execa(command, args, { cwd });
}

export async function cd(path: string) {
  cwd = path;
}
